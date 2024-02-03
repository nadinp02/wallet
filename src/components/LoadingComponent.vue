<template>
  <div class="d-flex justify-content-center mt-5">
    <div class="spinner-border spinner-border-sm mt-1 me-2" role="status"></div>
    <h5>Loading {{ name }}...</h5>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'Data', 
    },
  },
};
</script>

<style>
/* Agrega estilos según sea necesario */
</style>
