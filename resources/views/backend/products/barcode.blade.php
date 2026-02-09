@extends('backend.master')
@section('title', 'Barcode: ' . $product->name)
@section('content')

    <div class="alert alert-info no-print mb-3">
        <i class="fas fa-info-circle"></i> <strong>Note:</strong> Select your 
        <strong>Label Printer (40x20mm)</strong>. 
    </div>

    <div class="card">
        <div class="d-flex flex-column justify-content-center align-items-center p-4 bg-light no-print">
             
             <div id="label-template" style="display:none;">
                <div class="label-container">
                    <div class="price-row">
                        <span class="currency">{{ number_format($product->price, 0) }} DA</span>
                    </div>
                    <div class="barcode-wrapper">
                        <img src="data:image/png;base64,{{ $barcode }}" class="barcode-img">
                    </div>
                    <div class="sku-row">{{ $product->sku }}</div>
                </div>
             </div>

             <div style="width: 40mm; height: 20mm; background: white; border: 1px dashed #ccc; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; margin-bottom: 20px;">
                <div style="font-size: 8pt; font-weight: bold;">{{ number_format($product->price, 0) }} DA</div>
                <img src="data:image/png;base64,{{ $barcode }}" style="height: 8mm; max-width: 95%;">
                <div style="font-size: 6pt;">{{ $product->sku }}</div>
             </div>

             <div class="form-group row align-items-center">
                <label class="col-auto font-weight-bold">Copies:</label>
                <div class="col-auto">
                    <input type="number" id="copy-count" class="form-control" value="1" min="1" style="width: 100px; text-align: center;">
                </div>
             </div>
        </div>

        <div id="print-queue"></div>

        <div class="text-center mt-3 no-print pb-3">
            <button type="button" onclick="history.back()" class="btn btn-secondary mx-1">
                <i class="fas fa-arrow-left"></i> Retour
            </button>
            <button type="button" class="btn btn-primary mx-1" onclick="generateAndPrint()">
                <i class="fas fa-print"></i> Imprimer
            </button>
        </div>
    </div>
@endsection

@push('style')
    <style>
        #print-queue { display: none; }

        @media print {
            /* 1. Set Exact Paper Size */
            @page {
                size: 40mm 20mm;
                margin: 0;
            }

            body * { visibility: hidden; height: 0; }

            #print-queue {
                display: block !important;
                visibility: visible !important;
                position: absolute;
                top: 0; left: 0;
                width: 40mm;
            }

            .label-container {
                width: 40mm;
                height: 20mm;
                background: white;
                display: flex;
                flex-direction: column;
                justify-content: space-between; /* Distribute space */
                align-items: center;
                padding: 0.5mm 1mm; /* Very small padding */
                box-sizing: border-box;
                overflow: hidden;
                page-break-after: always; 
                break-after: page;
            }

            /* TOP: Price */
            .price-row { 
                font-family: Arial, sans-serif;
                font-weight: 900; 
                font-size: 10pt; /* Smaller font for small label */
                line-height: 1;
                text-align: center; 
                width: 100%; 
            }

            /* MIDDLE: Barcode (Crucial) */
            .barcode-wrapper {
                flex-grow: 1; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                width: 100%;
                overflow: hidden;
            }

            .barcode-img { 
                width: 98%; 
                height: 8mm; /* Fixed height to ensure scannability */
                object-fit: fill; 
            }

            /* BOTTOM: SKU */
            .sku-row { 
                font-family: 'Courier New', monospace; 
                font-weight: bold; 
                font-size: 7pt; /* Tiny font */
                line-height: 1;
                text-align: center; 
                white-space: nowrap; /* Prevent wrapping */
            }
        }
    </style>
@endpush

@push('script')
<script>
    function generateAndPrint() {
        const count = document.getElementById('copy-count').value;
        const queue = document.getElementById('print-queue');
        const template = document.getElementById('label-template').innerHTML; // Get HTML string

        queue.innerHTML = ''; // Clear old jobs

        // Create copies
        for (let i = 0; i < count; i++) {
             // Append the template string directly
            queue.insertAdjacentHTML('beforeend', template);
        }

        // Wait for images to render
        setTimeout(() => {
            window.print();
        }, 500);
    }
</script>
@endpush