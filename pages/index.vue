<template>
    <div>
    <p>Here is the home / presentation page for the app</p>
    <base-switch :value="ture" offText="ON" onText="OFF"></base-switch>
    </div>
</template>

<script>
export default {
    layout:'home',
    created(){
        //$nuxt.$router.push("/dashboard")
    }
    
}
</script>