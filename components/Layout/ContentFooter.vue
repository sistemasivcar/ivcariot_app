<template>
  <footer class="footer">
    <div class="container-fluid">
      <ul class="nav">
        <li class="nav-item">
          <a
            href=""
            target="_blank"
            rel="noopener"
            class="nav-link"
          >
            Home Page
          </a>
        </li>
        <li class="nav-item">
          <a
            href=""
            target="_blank"
            rel="noopener"
            class="nav-link"
          >
            About Us
          </a>
        </li>
      </ul>
      <div class="copyright">
        &copy; {{ year }} - A full web app 
        <a
          href="#"
          
          >to make IoT</a
        >
        easy.
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>
<style></style>
