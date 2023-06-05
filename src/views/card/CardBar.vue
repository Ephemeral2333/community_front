<template>
    <div>
        <login-welcome/>
        <tip-card/>
        <promotion-card/>
    </div>
</template>

<script>
import TipCard from "@/views/card/Tip.vue";
import PromotionCard from "@/views/card/Promotion.vue";
import LoginWelcome from "@/views/card/LoginWelcome.vue";

export default {
    name: 'CardBar',
    components: {
        LoginWelcome,
        PromotionCard,
        TipCard
    },
    data() {
        return {}
    },
    created() {
    },
    methods: {}
}
</script>
