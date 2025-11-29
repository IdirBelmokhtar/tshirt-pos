@extends('backend.master')
@section('title', 'Barcode: ' . $product->sku)
@section('content')

    <div class="text-left mb-3 no-print">
        <!-- Back button -->
        <button type="button" onclick="history.back()" class="btn bg-gradient-secondary text-white mx-1">
            <i class="fas fa-arrow-left"></i> Back
        </button>
    </div>

    <div class="card">

        <!-- Main content -->
        <div class="receipt-container mt-0" id="printable-section"
            style="width: 36mm; height: 18mm; font-family: 'Courier New', Courier, monospace; 
            margin: 0 auto; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; padding: 1px;">

            <img src="data:image/png;base64,{{ $barcode }}"
                style="width: 100%; height: 80%; object-fit: contain; display:block; margin:0 auto;">
            <p style="margin: 0; font-weight: bold; font-size: 8px; text-align:center;">{{ $product->sku }}</p>

        </div>

        <!-- Print button -->
        <div class="text-center mt-3 no-print pb-3">
            <button type="button" class="btn bg-gradient-primary text-white mx-1" onclick="window.print()">
                <i class="fas fa-print"></i> Print
            </button>
        </div>
    </div>
@endsection

@push('style')
    <style>
        .receipt-container {
            border: 1px dotted #000;
            padding: 2px;
        }

        /* Print styles for 36mm x 18mm thermal ticket */
        @media print {
            @page {
                size: 36mm 18mm;
                margin: 0;
            }

            body * {
                visibility: hidden;
                /* hide everything */
            }

            #printable-section,
            #printable-section * {
                visibility: visible;
                /* show only barcode div */
            }

            #printable-section {
                position: absolute;
                left: 0;
                top: 0;
                width: 36mm;
                height: 18mm;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                margin: 0;
                padding: 1px;
            }

            .no-print {
                display: none !important;
                /* hide buttons */
            }
        }
    </style>
@endpush
