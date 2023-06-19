<template>
    <article class="media">
        <figure class="media-left image is-48x48">
            <img :src="comment.avatar" class="is-rounded">
        </figure>
        <div class="media-content">
            <div class="content">
                <!--评论内容-->
                <p>
                    <strong>{{ comment.username }}</strong>
                    <small class="ml-2">{{ comment.createTime | date }}</small>
                    <br/>
                    {{ comment.content }}
                    <br>
                    <a @click="like(comment.id)">
                        <i v-if="!comment.favorite" slot="icon" class="fa fa-heart"></i>
                        <i v-else slot="icon" class="fa fa-heart" style="color: red"></i>
                    </a>
                    {{ comment.favor }} &nbsp;
                    <a :id="'reply-button' + comment.id" @click="replyComment(comment.id)">
                        <i slot="icon" class="fa fa-comment"></i>
                    </a>
                    &nbsp;
                    <a v-if="token && user.id === comment.userId" @click="removeComment(comment.id)">
                        <i slot="icon" class="fa fa-remove"></i>
                    </a>
                </p>


                <!--评论组件-->
                <div hidden="hidden" :id="'comments-form' + comment.id" v-model="comment.id">
                    <el-input
                        v-model="commentText"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入评论"
                        maxlength="400"
                        style="width: 400px"
                    >
                    </el-input>
                    <br><br>
                    <el-button type="primary" size="small" @click="reply()">发送</el-button>
                    &nbsp;
                    <el-button type="primary" size="small" @click="resetForm(comment.id)">取消</el-button>
                </div>

                <br>

                <lv-comments-item
                    v-for="children in comment.children"
                    :key="`comment-${children.id}`"
                    :comment="children"
                />
            </div>
        </div>
    </article>
</template>

<script>
import {mapGetters} from 'vuex'
import LvCommentsForm from "@/components/Comment/CommentsForm.vue";
import VueStar from 'vue-star'
import {favorComment} from "@/api/comments";
import {removeComment, replyComments} from "@/api/post";

export default {
    name: 'LvCommentsItem',
    components: {LvCommentsForm, VueStar},
    data() {
        return {
            commentText: ''
        }
    },
    mounted() {
        console.log(this.comment.content + " " + this.comment.favorite)
    },
    computed: {
        ...mapGetters([
            'token', 'user'
        ])
    },
    props: {
        comment: {
            type: Object,
            required: true
        },
        comments: {
            type: Array,
            required: true
        },
        topicId: {
            type: String,
            required: true
        }
    },
    methods: {
        replyComment(id) {
            if (this.token === null || this.token === '') {
                console.log(this.token)
                this.$message.warning('要先登录才能回复哦')
            } else {
                // id为comments-form+comment.id的div取消隐藏
                document.getElementById('comments-form' + id).hidden = false
            }
        },
        resetForm(id) {
            // id为comments-form+comment.id的div隐藏
            document.getElementById('comments-form' + id).hidden = true
        },
        async reply() {
            // 调用api，然后根据返回结果进行相应的操作
            let postData = {}
            postData['id'] = this.comment.id
            postData['content'] = this.commentText
            postData['topicId'] = this.topicId
            await replyComments(postData)
            this.$message.success('回复成功')
            // 重新加载页面
            window.location.reload()
        },
        removeComment(id) {
            // 询问是否删除
            this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                // 调用api，然后根据返回结果进行相应的操作
                await removeComment(id)
                this.$message.success('删除成功')
                // 重新加载页面
                window.location.reload()
            }).catch(() => {
                this.$message.info('已取消删除')
            })
        },
        async like(id) {
            // 如果是点赞，就点赞数加一，然后将comment.favorite设置为true
            if (!this.token || this.token === '') {
                this.$message.warning('要先登录才能点赞哦')
            } else {
                if (this.comment.favorite) {
                    this.comment.favor -= 1
                    this.comment.favorite = false
                    this.$message.success('取消点赞成功')
                } else {
                    this.comment.favor += 1
                    this.comment.favorite = true
                    this.$message.success('点赞成功')
                }
                await favorComment(this.comment.id);
            }
        },
    }
}
</script>


