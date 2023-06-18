<template>
    <article class="media">
        <div class="media-content">
            <form @submit.prevent="onSubmit">
                <b-field>
                    <b-input
                        v-model.lazy="commentText"
                        type="textarea"
                        maxlength="400"
                        placeholder="Add a comment..."
                        :disabled="isLoading"
                    ></b-input>
                </b-field>
                <nav class="level">
                    <div class="level-left">
                        <b-button
                            type="is-primary"
                            native-type="submit"
                            class="level-item"
                            :disabled="isLoading"
                        >
                            发送评论
                        </b-button>
                    </div>
                </nav>
            </form>
        </div>
    </article>
</template>

<script>
import {pushComment} from '@/api/comments'
export default {
    name: 'LvCommentsForm',
    data() {
        return {
            commentText: '',
            isLoading: false
        }
    },
    props: {
        slug: {
            type: String,
            default: null
        }
    },
    methods: {
        async onSubmit() {
            this.isLoading = true
            try {
                let postData = {}
                console.log(this.commentText)
                postData['id'] = null
                postData['content'] = this.commentText
                postData['topicId'] = this.slug
                // 调用api，然后根据返回结果进行相应的操作
                await pushComment(postData).then(res => {
                    const { code } = res;
                    if (code !== 200) {
                        this.$message.error('留言失败,请先登录')
                    }
                })
                this.$emit('loadComments', this.slug)
                this.$message.success('留言成功')
                this.commentText = ''
                window.location.reload()
            } catch (e) {
                this.$buefy.toast.open({
                    message: `Cannot comment this story. ${e}`,
                    type: 'is-danger'
                })
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>
