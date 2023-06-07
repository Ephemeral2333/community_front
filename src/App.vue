<template>
    <div>
        <div class="mb-5">
            <Header></Header>
        </div>

        <div class="container context">
            <router-view :key="this.$route.fullPath"></router-view>
        </div>
    </div>
</template>

<style>

</style>
<script setup>
import Header from "@/components/Layout/Header.vue";
import Footer from "@/components/Layout/Footer.vue";


</script>
