@extends('backend.master')

@section('title', 'Créer un produit')

@section('content')
<div class="card">
  <div class="card-body">
    <form action="{{ route('backend.admin.products.store') }}" method="post" class="accountForm"
      enctype="multipart/form-data">
      @csrf
      <div class="card-body">
        <div class="row">
          <div class="mb-3 col-md-6">
            <label for="title" class="form-label">
              Nom
              <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" placeholder="Entrez le nom" name="name"
              value="{{ old('name') }}" required>
          </div>
          <div class="mb-3 col-md-6" hidden>
            <label for="sku" class="form-label">
              Référence (SKU)
              <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" placeholder="Entrez le SKU" name="sku"
              value="{{ old('sku') }}" >
          </div>
          <div class="mb-3 col-md-6" hidden>
            <label for="brand_id" class="form-label">
              Marque
              <span class="text-danger">*</span>
            </label>
            <select class="form-control select2" style="width: 100%;" name="brand_id" >
              <option value="">Sélectionner une marque</option>
              @foreach ($brands as $item)
              <option value={{ $item->id }}
                {{ old('brand_id') == $item->id ? 'selected' : '' }}>
                {{ $item->name }}
              </option>
              @endforeach
            </select>
          </div>
          <div class="mb-3 col-md-6">
            <label for="category_id" class="form-label">
              Catégorie
              <span class="text-danger">*</span>
            </label>
            <select class="form-control select2" style="width: 100%;" name="category_id" required>
              <option value="">Sélectionner une catégorie</option>
              @foreach ($categories as $item)
              <option value={{ $item->id }}
                {{ old('category_id', $categories->first()->id) == $item->id ? 'selected' : '' }}>
                {{ $item->name }}
              </option>
              @endforeach
            </select>
          </div>
          <div class="mb-3 col-md-6">
            <label for="price" class="form-label">
              Prix
              <span class="text-danger">*</span>
            </label>
            <input type="number" step="0.01" min="0" class="form-control"
              placeholder="Entrez le prix" name="price" value="{{ old('price') }}" required>
          </div>
          <div class="mb-3 col-md-6">
          <label for="quantity" class="form-label">
            Stock initial
            <span class="text-danger">*</span>
          </label>
          <input type="number" class="form-control" placeholder="Entrez la quantité" name="quantity"
            value="{{ old('quantity') }}" required>
        </div>
          <div class="mb-3 col-md-6" hidden>
            <label for="unit_id" class="form-label">
              Unité
              <span class="text-danger">*</span>
            </label>
            <select class="form-control" style="width: 100%;" name="unit_id" >
              <option value="">Sélectionner une unité</option>
              @foreach ($units as $item)
              <option value={{ $item->id }}
                {{ old(key: 'unit_id') == $item->id ? 'selected' : '' }}>
                {{ $item->title . ' (' . $item->short_name . ')' }}
              </option>
              @endforeach
            </select>
          </div>
          <div class="mb-3 col-md-6" hidden>
            <label for="discount_type" class="form-label">
              Type de remise
            </label>
            <select class="form-control form-select" name="discount_type">
              <option value="">Sélectionnez le type de remise</option>
              <option value="fixed" {{ old('discount_type') == 'fixed' ? 'selected' : '' }}>
                Fixe
              </option>
              <option value="percentage"
                {{ old('discount_type') == 'percentage' ? 'selected' : '' }}>
                Pourcentage
              </option>
            </select>
          </div>
          <div class="mb-3 col-md-6">
            <label for="purchase_price" class="form-label">
              Prix d'achat
              <span class="text-danger">*</span>
            </label>
            <input type="number" step="0.01" min="0" class="form-control"
              placeholder="Entrez le prix d'achat" name="purchase_price" value="{{ old('purchase_price') }}" required>
          </div>
          <div class="mb-3 col-md-6" hidden>
            <label for="discount_value" class="form-label">
              Montant de la remise
            </label>
            <input type="number" step="0.01" min="0" class="form-control"
              placeholder="Entrez la remise" name="discount" value="{{ old('discount') }}">
          </div>
          <div class="mb-3 col-md-6">
            <label for="thumbnailInput" class="form-label">
              Image
            </label>
            <div class="image-upload-container" id="imageUploadContainer">
              <input type="file" class="form-control" name="product_image" id="thumbnailInput" accept="image/*" style="display: none;">
              <div class="thumb-preview" id="thumbPreviewContainer">
                <img src="{{ asset('backend/assets/images/blank.png') }}" alt="Aperçu de l'image"
                  class="img-thumbnail d-none" id="thumbnailPreview">
                <div class="upload-text">
                  <i class="fas fa-plus-circle"></i>
                  <span>Téléverser une image</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-3 col-md-12">
            <label for="description" class="form-label">
              Description
            </label>
            <textarea class="form-control" placeholder="Entrez la description" name="description">{{ old('description') }}</textarea>
          </div>

          <div class="mb-3 col-md-6" hidden>
            <label for="expire_date" class="form-label">
              Date d'expiration
            </label>
            <div class="input-group date" id="reservationdate" data-target-input="nearest">
              <input type="text" placeholder="Entrez la date d'expiration du produit" class="form-control datetimepicker-input" data-target="#reservationdate" name="expire_date" value="{{ old('expire_date') }}" />
              <div class="input-group-append" data-target="#reservationdate" data-toggle="datetimepicker">
                <div class="input-group-text"><i class="fa fa-calendar"></i></div>
              </div>
            </div>
          </div>
          <div class="mb-3 col-md-12">
            <div class="form-switch px-4">
              <input type="hidden" name="status" value="0">
              <input class="form-check-input" type="checkbox" name="status" id="active"
                value="1" checked>
              <label class="form-check-label" for="active">
                Actif
              </label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <button type="submit" class="btn bg-gradient-primary">Créer</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
@endsection

@push('style')
<style>
  .select2-container--default .select2-selection--single {
    height: calc(1.5em + 0.75rem + 2px) !important;
  }
</style>

@endpush
@push('script')
<script src="{{ asset('js/image-field.js') }}"></script>
<script>
  $(function() {
    //Date picker
    $('#reservationdate').datetimepicker({
      format: 'YYYY-MM-DD'
    });
  })
</script>
@endpush