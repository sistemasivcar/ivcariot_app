<template>
    <div>
        
    </div>
</template>

<script>
export default {
    middleware:'authtenticated',
    mounted(){
        this.$router.replace('/app/dashboard');
    }
}
</script>