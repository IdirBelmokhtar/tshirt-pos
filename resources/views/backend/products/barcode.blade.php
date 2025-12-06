@extends('backend.master')
@section('title', 'Code-barres du produit: ' . $product->name)
@section('content')

    <div class="text-left mb-3 no-print">
        <!-- Back button -->
        <button type="button" onclick="history.back()" class="btn bg-gradient-secondary text-white mx-1">
            <i class="fas fa-arrow-left"></i> Retour
        </button>
    </div>

    <div class="card">
        <!-- Main content -->
        <div id="printable-section"
            style="
                width: 56mm;
                height: 30mm;
                margin: 0 auto;
                padding: 2mm 1.5mm;
                background: white;
                border: 0.5px solid #ccc;
                font-family: 'Arial Narrow', Arial, sans-serif;
                box-sizing: border-box;
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
             ">
            <!-- Price section - centered at the top -->
            <div
                style="
                text-align: center;
                margin-bottom: 1mm;
                flex-shrink: 0;
            ">
                <div
                    style="
                    font-size: 16pt;
                    font-weight: bold;
                    color: #e53935;
                    white-space: nowrap;
                ">
                    {{ $product->price }} DA
                </div>
            </div>

            <!-- Barcode section -->
            <div
                style="
                text-align: center;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
            ">
                <!-- Barcode image -->
                <img src="data:image/png;base64,{{ $barcode }}"
                    style="
                         width: 100%;
                         max-height: 15mm;
                         object-fit: contain;
                         display: block;
                         margin-bottom: 0.5mm;
                     ">

                <!-- SKU number -->
                <div
                    style="
                    font-family: 'Courier New', monospace;
                    font-size: 8pt;
                    color: #333;
                    letter-spacing: 0.5px;
                    margin-top: 0.5mm;
                ">
                    {{ $product->sku }}
                </div>

                <!-- SKU label -->
                <div
                    style="
                    font-size: 6pt;
                    color: #666;
                    text-transform: uppercase;
                    margin-top: 0.3mm;
                ">
                    Griffa Store
                </div>
            </div>
        </div>

        <!-- Print button -->
        <div class="text-center mt-3 no-print pb-3">
            <button type="button" class="btn bg-gradient-primary text-white mx-1" onclick="window.print()">
                <i class="fas fa-print"></i> Imprimer
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

        /* Print styles for 56mm x 30mm label */
        @media print {
            @page {
                size: 56mm 30mm;
                margin: 0;
            }

            body * {
                visibility: hidden;
            }

            #printable-section,
            #printable-section * {
                visibility: visible;
            }

            #printable-section {
                position: absolute;
                left: 0;
                top: 0;
                width: 56mm !important;
                height: 30mm !important;
                margin: 0 !important;
                padding: 2mm 1.5mm !important;
                border: 0.5px solid #000 !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .no-print {
                display: none !important;
            }
        }
    </style>

    <!-- Optional: Load barcode font if needed -->
    <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39+Text&display=swap" rel="stylesheet">
@endpush

{{-- You must wait moment to read the barcode in the screen --}}
{{-- @push('script')
<script>
  window.addEventListener("load", window.print());
</script>
@endpush --}}