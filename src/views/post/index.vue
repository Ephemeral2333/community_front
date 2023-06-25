<template>
    <div>
        <el-card shadow="never">
            <div slot="header" class="clearfix">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="最新主题" name="latest">
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
                                                &nbsp;
                                                <span v-if="item.essence" class="tag is-warning is-light">精华</span>
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
                                    <span class="is-hidden-mobile">
                                        👁️‍🗨️ {{ item.view }}
                                        &nbsp;
                                        👍 {{ item.favor }}
                                        &nbsp;
                                        💭 {{ item.comments }}
                                    </span>
                                </nav>
                            </div>
                            <div class="media-right"/>
                        </article>
                    </el-tab-pane>
                    <el-tab-pane label="最热主题" name="hot">
                        <article v-for="(item, index) in articleList" :key="index" class="media">
                            <div class="media-left">
                                <figure class="image is-48x48">
                                    <img :src="item.author.headUrl"
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
                                                &nbsp;
                                                <span v-if="item.essence" class="tag is-warning is-light">精华</span>
                                            </router-link>
                                        </el-tooltip>
                                    </p>
                                </div>
                                <nav class="level has-text-grey is-mobile  is-size-7 mt-2">
                                    <div class="level-left">
                                        <router-link class="level-item"
                                                     :to="{ path: `/member/${item.author.username}/home` }">
                                            {{ item.author.nickname }}
                                        </router-link>
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
                                    <span class="is-hidden-mobile">
                                        👁️‍🗨️ {{ item.view }}
                                        &nbsp;
                                        👍 {{ item.favor }}
                                        &nbsp;
                                        💭 {{ item.comments }}
                                    </span>
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

import {getPostList} from "@/api/post";
import dayjs from "dayjs";
import Pagination from "@/components/Pagination";

export default {
    name: 'TopicList',
    components: {Pagination},
    data() {
        return {
            activeName: 'latest',
            articleList: [],
            page: {
                current: 1,
                size: 10,
                total: 0,
                tab: 'latest'
            },
        }
    },
    created() {
        this.init(this.tab)
    },
    methods: {
        dayjs,
        init(tab) {
            getPostList(this.page.current, this.page.size, tab).then((response) => {
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
        }
    }
}
</script>
