<template>
    <div class="member">
        <div class="columns">
            <div class="column is-one-quarter">
                <el-card shadow="never">
                    <div slot="header" class="has-text-centered">
                        <el-avatar :size="64"
                                   :src="topicUser.headUrl"/>
                        <p class="mt-3">{{ topicUser.nickname || topicUser.username }}</p>
                        <button v-if="token && topicUser.username === user.username"
                                class="button is-primary is-small mt-3"
                                @click="dialogVisible = true">
                            更换头像
                        </button>
                    </div>
                    <div>
                        <p class="content">入驻：{{ dayjs(topicUser.createTime).format("YYYY/MM/DD HH:MM:ss") }}</p>
                        <p class="content">简介：{{ topicUser.description }}</p>
                    </div>
                </el-card>
            </div>

            <div class="column">
                <el-card class="box-card content" shadow="never">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="话题" name="topic">
                            <div slot="header" class="has-text-weight-bold">
                                <span>话题</span>
                            </div>

                            <div v-if="topics.length===0">
                                暂无话题
                            </div>

                            <div v-else class="topicUser-info">
                                <article v-for="(item, index) in topics" :key="index" class="media">
                                    <div class="media-content">
                                        <div class="content ellipsis is-ellipsis-1">
                                            <el-tooltip class="item" effect="dark" :content="item.title"
                                                        placement="top">
                                                <router-link :to="{ name: 'post-detail', params: { id: item.id } }">
                                                    {{ item.title }}
                                                </router-link>
                                            </el-tooltip>
                                        </div>
                                        <nav class="level has-text-grey is-size-7">
                                            <div class="level-left">
                    <span class="mr-1">
                      发布于:{{ dayjs(item.createTime).format("YYYY/MM/DD HH:mm:ss") }}
                    </span>
                                            </div>
                                        </nav>
                                    </div>
                                    <div v-if="token" class="media-right">
                                        <div v-if="topicUser.username === user.username" class="level">
                                            <div class="level-item mr-1">
                                                <router-link :to="{name:'topic-edit',params: {id:item.id}}">
                                                    <span class="tag is-warning">编辑</span>
                                                </router-link>
                                            </div>
                                            <div class="level-item">
                                                <a @click="handleDelete(item.id)">
                                                    <span class="tag is-danger">删除</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane label="关注" name="follow">
                            <div v-if="followers.length===0">
                                暂无关注
                            </div>

                            <div v-else class="topicUser-info">
                                <article v-for="(item, index) in followers" :key="index" class="media">
                                    <!--圆形头像-->
                                    <el-avatar :size="40" :src="item.avatar"></el-avatar>
                                    &nbsp;&nbsp;&nbsp;
                                    <div class="media-content"
                                    style="padding-top: 10px">
                                        <div class="content ellipsis is-ellipsis-1">
                                            <el-tooltip class="item" effect="dark" :content="item.nickname"
                                                        placement="top">
                                                <router-link :to="{ name: 'user', params: { username: item.username } }"
                                                style="margin-top: 20px">
                                                    {{ item.nickname }}
                                                </router-link>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                    <div v-if="token" class="media-right">
                                        <div v-if="topicUser.username === user.username" class="level"
                                        style="padding-top: 9px">
                                            <el-button type="danger" size="mini" @click="handleUnFollow(item.id)">
                                                取消关注
                                            </el-button>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane label="粉丝" name="fans">
                            <div v-if="fans.length===0">
                                暂无粉丝
                            </div>

                            <div v-else class="topicUser-info">
                                <article v-for="(item, index) in fans" :key="index" class="media">
                                    <!--圆形头像-->
                                    <el-avatar :size="40" :src="item.avatar"></el-avatar>
                                    &nbsp;&nbsp;&nbsp;
                                    <div class="media-content"
                                         style="padding-top: 10px">
                                        <div class="content ellipsis is-ellipsis-1">
                                            <el-tooltip class="item" effect="dark" :content="item.nickname"
                                                        placement="top">
                                                <router-link :to="{ name: 'user', params: { username: item.username } }"
                                                             style="margin-top: 20px">
                                                    {{ item.nickname }}
                                                </router-link>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </el-tab-pane>

                        <pagination
                            v-show="page.total > 0"
                            class="mt-5"
                            :total="page.total"
                            :page.sync="page.current"
                            :limit.sync="page.size"
                            @pagination="fetchUserById"
                        />
                    </el-tabs>
                </el-card>
            </div>

            <el-dialog title="更换头像" :visible.sync="dialogVisible" style="width: 1000px">
                <el-upload
                    align="center"
                    class="avatar-uploader"
                    action="http://localhost:8080/front/file/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="topicUser.headUrl" :src="topicUser.headUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                        </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {getInfo, getUploadToken, savePhoto} from '@/api/user'
import pagination from '@/components/Pagination/index'
import {mapGetters} from 'vuex'
import {handleDelete} from '@/api/post'
import dayjs from "dayjs";
import {getFansList, getFollowList, unFollow} from "@/api/follow";

export default {
    name: 'Profile',
    components: {pagination},
    data() {
        return {
            topicUser: {},
            followers: {},
            fans: {},
            topics: {},
            page: {
                current: 1,
                size: 5,
                total: 0
            },
            activeName: 'topic',
            dialogVisible: false,
            uploadToken: ''
        }
    },
    computed: {
        ...mapGetters(['token', 'user'])
    },
    created() {
        this.fetchUserById()
    },
    mounted() {
    },
    methods: {
        dayjs,
        fetchUserById() {
            getInfo(this.$route.params.username, this.page.current, this.page.size).then(async (res) => {
                const {data} = res
                this.topicUser = data.user
                this.page.current = data.currentPage
                this.page.size = data.pageSize
                this.page.total = data.total
                this.topics = data.records

                if (this.topicUser.username === this.user.username) {
                    const {data} = await getUploadToken()
                    this.uploadToken = data
                }
            });
        },
        handleDelete(id) {
            // 询问是否删除
            this.$confirm('此操作将永久删除该话题, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                handleDelete(id).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    window.location.reload()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        async handleAvatarSuccess(res) {
            this.topicUser.headUrl = res.data
            await savePhoto(this.topicUser.headUrl, this.topicUser.id)
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        getFollowers() {
            getFollowList(this.page.current, this.page.size, this.$route.params.username).then((res) => {
                const {data} = res
                this.page.current = data.page
                this.page.size = data.size
                this.page.total = data.total
                this.followers = data.items
            });
        },
        getFans() {
            getFansList(this.page.current, this.page.size, this.$route.params.username).then((res) => {
                const {data} = res
                this.page.current = data.page
                this.page.size = data.size
                this.page.total = data.total
                this.fans = data.items
            });
        },
        handleClick(tab) {
            if (tab.name === 'topic') {
                this.fetchUserById()
            } else if (tab.name === 'follow') {
                this.getFollowers()
            } else if (tab.name === 'fans') {
                this.getFans()
            }
        },
        handleUnFollow(id) {
            this.$confirm('此操作将取消关注该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                unFollow(id).then(() => {
                    this.$message({
                        type: 'success',
                        message: '取消关注成功!'
                    })
                    window.location.reload()
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
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
