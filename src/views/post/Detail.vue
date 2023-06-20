<template>
    <div class="columns">
        <div class="column is-three-quarters">
            <el-card
                class="box-card"
                shadow="never"
            >
                <div
                    slot="header"
                    class="has-text-centered"
                >
                    <p class="is-size-5 has-text-weight-bold">{{ topic.title }}</p>
                    <div class="has-text-grey is-size-7 mt-3">
                        <span>{{ dayjs(topic.createTime).format('YYYY/MM/DD HH:mm:ss') }}</span>
                        <el-divider direction="vertical"/>
                        <span v-if="!topic.anonymous">发布者：{{ topicUser.nickname }}</span>
                        <span v-else>发布者：匿名</span>
                        <el-divider direction="vertical"/>
                        <span>浏览：{{ topic.view }}</span>
                    </div>
                </div>

                <div id="preview" />

                <nav class="level has-text-grey is-size-7 mt-6">
                    <div class="level-left">
                        <p class="level-item">
                            <b-taglist>
                                <router-link
                                    v-for="(tag, index) in tags"
                                    :key="index"
                                    :to="{ name: 'tag', params: { name: tag.id } }"
                                >
                                    <b-tag type="is-info is-light mr-1">
                                        {{ "#" + tag.name }}
                                    </b-tag>
                                </router-link>
                                <router-link v-if="topic.view >= 500"
                                             :to="{ name: 'tag', params: { name: '热门' } }"
                                >
                                </router-link>
                            </b-taglist>
                        </p>
                    </div>
                    <div
                        v-if="token && user.id === topicUser.id"
                        class="level-right"
                    >
                        <router-link
                            class="level-item"
                            :to="{name:'topic-edit',params: {id:topic.id}}"
                        >
                            <span class="tag">编辑</span>
                        </router-link>
                        <a class="level-item">
              <span
                  class="tag"
                  @click="handleDelete(topic.id)"
              >删除</span>
                        </a>
                    </div>
                </nav>
            </el-card>

            <lv-comments :slug="topic.id" />
        </div>

        <div class="column">
            <Author
                v-if="flag && !topic.anonymous"
                :user="topicUser"
            />
            <recommend
                v-if="flag"
            />
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getTopic, handleDelete} from "@/api/post";
import Vditor from "vditor";
import Comments from "@/components/Comment/Comments.vue";
import dayjs from "dayjs";
import 'vditor/dist/index.css'
import Author from "@/views/post/Author.vue";
import Recommend from "@/views/post/Recommend.vue";
import LvComments from "@/components/Comment/Comments.vue";

export default {
    name: 'TopicDetail',
    components: {
        LvComments,
        Author,
        Recommend,
        Comments
    },
    computed: {
        ...mapGetters([
            'token', 'user'
        ])
    },
    data() {
        return {
            flag: false,
            topic: {
                title: '',
                content: '',
                id: this.$route.params.id,
                view: 0,
                anonymous: false
            },
            tags: [],
            topicUser: {}
        }
    },
    mounted() {
        this.fetchTopic()
    },
    methods: {
        dayjs,
        renderMarkdown(md) {
            Vditor.preview(document.getElementById('preview'), md, {
                hljs: { style: 'github' }
            })
        },
        // 初始化
        async fetchTopic() {
            getTopic(this.$route.params.id).then(response => {
                const {data} = response
                document.title = data.title
                this.topic.title = data.title
                this.topic.content = data.content
                this.topic.view = data.view
                this.topic.anonymous = data.anonymous
                this.tags = data.tags
                this.topicUser = data.author
                this.renderMarkdown(this.topic.content)
                this.flag = true
            })
        },
        handleDelete(id) {
            this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                handleDelete(id).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.$router.push({name: 'home'})
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        }
    }
}
</script>


<style>
#preview {
    min-height: 300px;
}
</style>
