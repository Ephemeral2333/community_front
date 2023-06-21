<template>
    <div>
        <el-card shadow="never">
            <div slot="header" class="clearfix">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="收藏帖子" name="collect">
                        <article v-for="(item, index) in articleList" :key="index" class="media">
                            <div class="media-left">
                                <figure class="image is-48x48">
                                    <img v-if="!item.anonymous" :src="item.author.headUrl"
                                         style="border-radius: 5px;">
                                    <img v-else src="https://img0.baidu.com/it/u=1758930662,2482245815&fm=253&fmt=auto&app=138&f=JPEG?w=501&h=500"
                                         style="border-radius: 5px;">
                                </figure>
                            </div>
                            <div class="media-content">
                                <div class="">
                                    <p class="ellipsis is-ellipsis-1">
                                        <el-tooltip class="item" effect="dark" :content="item.title" placement="top">
                                            <router-link :to="{name:'post-detail',params:{id:item.id}}">
                                                <span class="is-size-6">{{ item.title }}</span>
                                                &nbsp;
                                                <span v-if="item.top" class="tag is-danger is-light">置顶</span>
                                            </router-link>
                                        </el-tooltip>
                                    </p>
                                </div>
                                <nav class="level has-text-grey is-mobile  is-size-7 mt-2">
                                    <div class="level-left">
                                        <router-link v-if="!item.anonymous" class="level-item"
                                                     :to="{ path: `/member/${item.author.username}/home` }">
                                            {{ item.author.nickname }}
                                        </router-link>
                                        <span v-else class="level-item">
                                            匿名
                                        </span>
                                        <span class="mr-1">
                                            发布于:{{ dayjs(item.updateTime).format("YYYY/MM/DD HH:mm:ss") }}
                                        </span>
                                    </div>
                                    <span
                                        v-for="(tag, index) in item.tags"
                                        :key="index"
                                        class="tag is-hidden-mobile is-success is-light mr-1"
                                    >
                                        <router-link :to="{ name: 'tag', params: { name: tag.id } }">
                                          {{ "#" + tag.name }}
                                        </router-link>
                                    </span>
                                    <div>
                                        <span class="is-hidden-mobile">
                                            👁️‍🗨️ {{ item.view }}
                                            &nbsp;
                                            👍 {{ item.favor }}
                                        </span>
                                        &nbsp;&nbsp;
                                        <el-button
                                            type="warning"
                                            icon="el-icon-star-on"
                                            size="mini"
                                            @click="cancelCollect(item.id)"
                                        >
                                            {{ item.collects }}
                                        </el-button>
                                    </div>
                                </nav>
                            </div>
                            <div class="media-right"/>
                        </article>
                    </el-tab-pane>
                    <el-tab-pane label="点赞帖子" name="favor">
                        <article v-for="(item, index) in articleList" :key="index" class="media">
                            <div class="media-left">
                                <figure class="image is-48x48">
                                    <img v-if="!item.anonymous" :src="item.author.headUrl"
                                         style="border-radius: 5px;">
                                    <img v-else src="https://img0.baidu.com/it/u=1758930662,2482245815&fm=253&fmt=auto&app=138&f=JPEG?w=501&h=500"
                                         style="border-radius: 5px;">
                                </figure>
                            </div>
                            <div class="media-content">
                                <div class="">
                                    <p class="ellipsis is-ellipsis-1">
                                        <el-tooltip class="item" effect="dark" :content="item.title" placement="top">
                                            <router-link :to="{name:'post-detail',params:{id:item.id}}">
                                                <span class="is-size-6">{{ item.title }}</span>
                                                &nbsp;
                                                <span v-if="item.top" class="tag is-danger is-light">置顶</span>
                                            </router-link>
                                        </el-tooltip>
                                    </p>
                                </div>
                                <nav class="level has-text-grey is-mobile  is-size-7 mt-2">
                                    <div class="level-left">
                                        <router-link v-if="!item.anonymous" class="level-item"
                                                     :to="{ path: `/member/${item.author.username}/home` }">
                                            {{ item.author.nickname }}
                                        </router-link>
                                        <span v-else class="level-item">
                                            匿名
                                        </span>
                                        <span class="mr-1">
                                            发布于:{{ dayjs(item.createTime).format("YYYY/MM/DD") }}
                                        </span>
                                    </div>
                                    <span v-if="item.view >= 5000" type="is-info is-light mr-1" style="color: red">
                                        {{ "#" + '热门' }}
                                    </span>
                                    <span v-if="item.favor >= 500" type="is-info is-light mr-1" style="color: gold">
                                        {{ "#" + '多人点赞' }}
                                    </span>
                                    <span
                                        v-for="(tag, index) in item.tags"
                                        :key="index"
                                        class="tag is-hidden-mobile is-success is-light mr-1"
                                    >
                                        <router-link :to="{ name: 'tag', params: { name: tag.id } }">
                                          {{ "#" + tag.name }}
                                        </router-link>
                                    </span>
                                    <div>
                                        <span class="is-hidden-mobile">
                                            👁️‍🗨️ {{ item.view }}
                                            &nbsp;
                                            👍 {{ item.favor }}
                                        </span>
                                        &nbsp;&nbsp;
                                        <el-button
                                            type="danger"
                                            icon=""
                                            size="mini"
                                            @click="cancelFavor(item.id)"
                                        >
                                            💕 {{ item.favor }}
                                        </el-button>
                                    </div>
                                </nav>
                            </div>
                            <div class="media-right"/>
                        </article>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <!--分页-->
            <pagination
                v-show="page.total > 0"
                :total="page.total"
                :page.sync="page.current"
                :limit.sync="page.size"
                @pagination="handleChange"
            />
        </el-card>
    </div>
</template>

<script>

import {collect, getMyCollect, getPostList, unFavorite} from "@/api/post";
import dayjs from "dayjs";
import Pagination from "@/components/Pagination";

export default {
    name: 'MyCollection',
    components: {Pagination},
    data() {
        return {
            activeName: 'latest',
            articleList: [],
            page: {
                current: 1,
                size: 10,
                total: 0,
                tab: 'collect'
            },
        }
    },
    created() {
        this.tab = "collect"
        this.activeName = this.tab
        this.init(this.tab)
    },
    methods: {
        dayjs,
        init(tab) {
            getMyCollect(this.page.current, this.page.size, tab).then((response) => {
                const {data} = response
                this.page.current = data.currentPage
                this.page.size = data.pageSize
                this.page.total = data.total
                this.articleList = data.list
            })
        },
        // 处理分页
        handleChange() {
            getPostList(this.page.current, this.page.size, this.activeName).then((response) => {
                const {data} = response
                this.page.current = data.currentPage
                this.page.size = data.pageSize
                this.page.total = data.total
                this.articleList = data.list
            })
        },
        handleClick(tab) {
            this.page.current = 1
            this.init(tab.name)
        },
        cancelCollect(id) {
            this.$confirm('此操作将取消收藏, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await collect(id);
                this.$message({
                    type: 'success',
                    message: '取消收藏成功!'
                });
                window.location.reload()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消取消收藏'
                });
            });
        },
        cancelFavor(id) {
            this.$confirm('此操作将取消点赞, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await unFavorite(id);
                this.$message({
                    type: 'success',
                    message: '取消点赞成功!'
                });
                window.location.reload()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消取消点赞'
                });
            });
        }
    }
}
</script>
