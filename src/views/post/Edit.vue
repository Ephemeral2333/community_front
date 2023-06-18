<template>
    <div class="columns">
        <div class="column is-full">
            <el-card
                class="box-card"
                shadow="never"
            >
                <div
                    slot="header"
                    class="clearfix"
                >
                    <span><i class="fa fa fa-book"> 修改文章 </i></span>
                </div>
                <div>
                    <el-form
                        ref="ruleForm"
                        :model="ruleForm"
                        :rules="rules"
                        class="demo-ruleForm"
                    >
                        <el-form-item prop="title">
                            <el-input
                                v-model="ruleForm.title"
                                placeholder="输入主题名称"
                            />
                        </el-form-item>

                        <!--Markdown-->
                        <div style="border: 1px solid #ccc; margin-top: 10px">
                            <!-- 工具栏 -->
                            <Toolbar
                                style="border-bottom: 1px solid #ccc"
                                :editor="editor"
                                :defaultConfig="toolbarConfig"
                            />
                            <!-- 编辑器 -->
                            <Editor
                                style="height: 400px; overflow-y: hidden"
                                :defaultConfig="editorConfig"
                                v-model="html"
                                @onCreated="onCreated"

                            />
                        </div>

                        <div class="contain">

                        </div>

                        <b-taginput
                            v-model="ruleForm.tags"
                            class="my-3"
                            maxlength="15"
                            maxtags="3"
                            ellipsis
                            placeholder="请输入主题标签，限制为 15 个字符和 3 个标签"
                        />

                        <el-form-item>
                            <el-button
                                type="primary"
                                @click="submitForm('ruleForm')"
                            >立即修改
                            </el-button>
                            <el-button @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import {getTopic, updatePost} from '@/api/post'
import 'vditor/dist/index.css'
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";

export default {
    name: 'topic-edit',
    components: {
        Editor, Toolbar
    },
    data() {
        return {
            html: '',
            editor: null,
            toolbarConfig: {
                // toolbarKeys: [ /* 显示哪些菜单，如何排序、分组 */ ],
                // excludeKeys: [ /* 隐藏哪些菜单 */ ],
            },
            editorConfig: {
                placeholder: "请输入内容...",
                MENU_CONF: {},
            },
            ruleForm: {
                id: '', // ID
                title: '', // 标题
                tags: [], // 标签
                content: '' // 内容
            },
            rules: {
                title: [
                    {required: true, message: '请输入话题名称', trigger: 'blur'},
                    {
                        min: 1,
                        max: 25,
                        message: '长度在 1 到 25 个字符',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    mounted() {
        this.fetchTopic();
    },
    beforeDestroy() {
        const editor = this.editor;
        if (editor == null) return;
        editor.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
    },
    methods: {
        onCreated(editor) {
            this.editor = Object.seal(editor); // 【注意】一定要用 Object.seal() 否则会报错
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (
                        this.editor.getHtml().length === 1 ||
                        this.editor.getHtml() == null ||
                        this.editor.getHtml() === ''
                    ) {
                        alert('话题内容不可为空')
                        return false
                    }
                    if (this.ruleForm.tags == null || this.ruleForm.tags.length === 0) {
                        alert('标签不可以为空')
                        return false
                    }
                    this.ruleForm.content = this.editor.getHtml()
                    updatePost(this.ruleForm).then((response) => {
                        const { data } = response
                        setTimeout(() => {
                            this.$router.push({
                                name: 'post-detail',
                                params: { id: data.id }
                            })
                        }, 800)
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.html = '';
            this.ruleForm.tags = [];
        },
        fetchTopic() {
            getTopic(this.$route.params.id).then((value) => {
                this.ruleForm.id = this.$route.params.id;
                this.ruleForm.title = value.data.title;
                this.ruleForm.tags = value.data.tags.map(tag => tag.name);
                this.html = value.data.content;
            });
        },
    }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>

