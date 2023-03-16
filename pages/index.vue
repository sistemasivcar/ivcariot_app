<template>
    <div>
        
    </div>
</template>

<script>
export default {
    middleware:'authtenticated',
    mounted(){
        this.$router.replace('/app/dashboard');
    },
    head: {
    title: 'Ivcar - Plataforma IoT - Conectá tus Dispositivos a la Nube',
    meta: [
      {
        hid: 'subí tus dispositivos a la nube',
        name: 'subí tus dispositivos a la nube',
        content: 'subí tus dispositivos a la nube, comenzá tu emprendimiento IoT'
      }
    ],
  }
}
</script>