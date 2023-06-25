<template>
    <section class="box comments">
        <hr />
        <h3 class="title is-5">评论</h3>
        <lv-comments-form :slug="slug" v-if="token" @loadComments="fetchComments"/>

        <span v-if="comments.length === 0">暂无评论</span>

        <lv-comments-item
            v-for="comment in comments"
            :key="`comment-${comment.id}`"
            :comment="comment"
            :topicId="slug"
        />
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchCommentsTopicId } from '@/api/comments'
import LvCommentsForm from './CommentsForm'
import LvCommentsItem from './CommentsItem'

export default {
    name: 'LvComments',
    components: {
        LvCommentsForm,
        LvCommentsItem
    },
    data() {
        return {
            comments: []
        }
    },
    props: {
        slug: {
            type: String,
            default: null
        }
    },
    computed: {
        ...mapGetters([
            'token'
        ])
    },
    async mounted() {
        await this.fetchComments(this.slug)
    },
    methods: {
        // 初始化
        async fetchComments(topic_id) {
            fetchCommentsTopicId(topic_id).then(response => {
                const { data } = response
                this.comments = data
            })
        }
    }
}
</script>
