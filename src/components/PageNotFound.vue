<template>
  <div class="wrapper">
    <div>
      <div class="title">404</div>
    </div>
    <h1 style="margin-top: 50px">Страница не найдена</h1>
  </div>
</template>

<script>
export default {
  name: "PageNotFound",
};
</script>

<style scoped>

.title {
  min-height: 100px;
  font-size: 300px !important;
}

.wrapper {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  align-items: center;
  flex-direction: column;
}

</style>
