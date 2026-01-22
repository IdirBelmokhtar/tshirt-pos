<?php

namespace App\Http\Controllers\Backend\Report;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class ReportController extends Controller
{

    public function saleReport(Request $request)
    {

        abort_if(!auth()->user()->can(abilities: 'reports_sales'), 403);
        // Get user input or set default values
        $start_date_input = $request->input('start_date', Carbon::today()->subDays(29)->format('Y-m-d'));
        $end_date_input = $request->input('end_date', Carbon::today()->format('Y-m-d'));

        // Parse and set start date
        $start_date = Carbon::createFromFormat('Y-m-d', $start_date_input) ?: Carbon::today()->subDays(29)->startOfDay();
        $start_date = $start_date->startOfDay();

        // Parse and set end date
        $end_date = Carbon::createFromFormat('Y-m-d', $end_date_input) ?: Carbon::today()->endOfDay();
        $end_date = $end_date->endOfDay();
        // Retrieve orders within the date range
        $orders = Order::whereBetween('created_at', [$start_date, $end_date])->with('customer')->get();

        // Calculate totals
        $data = [
            'orders' => $orders,
            'sub_total' => $orders->sum('sub_total'),
            'discount' => $orders->sum('discount'),
            'paid' => $orders->sum('paid'),
            'due' => $orders->sum('due'),
            'total' => $orders->sum('total'),
            'start_date' => $start_date->format('M d, Y'),
            'end_date' => $end_date->format('M d, Y'),
        ];

        return view('backend.reports.sale-report', $data);
    }
    public function saleSummery(Request $request)
    {

        abort_if(!auth()->user()->can('reports_summary'), 403);
        // Get user input or set default values
        $start_date_input = $request->input('start_date', Carbon::today()->format('Y-m-d'));
        $end_date_input = $request->input('end_date', Carbon::today()->format('Y-m-d'));

        // Parse and set start date
        $start_date = Carbon::createFromFormat('Y-m-d', $start_date_input) ?: Carbon::today()->startOfDay();
        $start_date = $start_date->startOfDay();

        // Parse and set end date
        $end_date = Carbon::createFromFormat('Y-m-d', $end_date_input) ?: Carbon::today()->endOfDay();
        $end_date = $end_date->endOfDay();
        // Retrieve orders within the date range
        $orders = Order::whereBetween('created_at', [$start_date, $end_date])->get();

        $total_credit = Customer::sum('credit');

        // Calculate totals
        $total_purchase = 0;

        // candidate relation names and attribute names to detect purchase amount
        $candidateRelations = ['orderItems', 'order_items', 'orderDetails', 'order_details', 'items', 'products', 'order_item'];
        $candidateAttributes = ['total_purchase', 'purchase_total', 'purchase', 'purchase_amount'];

        foreach ($orders as $order) {
            // If the order has a direct purchase attribute, use it
            $found = false;
            foreach ($candidateAttributes as $attr) {
            if (isset($order->$attr) && is_numeric($order->$attr)) {
                $total_purchase += $order->$attr;
                $found = true;
                break;
            }
            }
            if ($found) {
            continue;
            }

            // Otherwise try to sum from related items (purchase_price * quantity)
            foreach ($candidateRelations as $rel) {
            if (method_exists($order, $rel)) {
                $items = $order->$rel;
                foreach ($items as $it) {
                $price = $it->purchase_price ?? $it->cost_price ?? $it->unit_cost ?? ($it->pivot->purchase_price ?? ($it->pivot->cost_price ?? 0));
                $qty = $it->quantity ?? $it->qty ?? ($it->pivot->quantity ?? 1);
                $total_purchase += (float) ($price ?: 0) * (float) ($qty ?: 0);
                }
                $found = true;
                break;
            }
            }
        }

        $data = [
            'sub_total' => $orders->sum('sub_total'),
            'discount' => $orders->sum('discount'),
            'paid' => $orders->sum('paid'),
            'due' => $orders->sum('due'),
            'total' => $orders->sum('total'),
            'total_purchase' => $total_purchase,
            'total_credit' => $total_credit,
            'start_date' => $start_date->format('M d, Y'),
            'end_date' => $end_date->format('M d, Y'),
        ];

        return view('backend.reports.sale-summery', $data);
    }
    function inventoryReport(Request $request)
    {

        abort_if(!auth()->user()->can('reports_inventory'), 403);
        if ($request->ajax()) {
            $products = Product::latest()->active()->get();
            return DataTables::of($products)
                ->addIndexColumn()
                ->addColumn('name', fn($data) => $data->name)
                ->addColumn('sku', fn($data) => $data->sku)
                ->addColumn(
                    'price',
                    fn($data) => $data->discounted_price .
                        ($data->price > $data->discounted_price
                            ? '<br><del>' . $data->price . '</del>'
                            : '')
                )
                ->addColumn('quantity', fn($data) => $data->quantity . ' ' . optional($data->unit)->short_name)
                ->rawColumns(['name', 'sku', 'price', 'quantity', 'status'])
                ->toJson();
        }
        return view('backend.reports.inventory');
    }
}
