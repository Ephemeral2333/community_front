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

                        <div id="vditor" />

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
import Vditor from 'vditor'

export default {
    name: 'topic-edit',
    data() {
        return {
            contentEditor: {},
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
        this.contentEditor = new Vditor('vditor', {
            height: 500,
            placeholder: '此处为话题内容……',
            theme: 'classic',
            counter: {
                enable: true,
                type: 'markdown'
            },
            preview: {
                delay: 0,
                hljs: {
                    style: 'monokai',
                    lineNumber: true
                }
            },
            tab: '\t',
            typewriterMode: true,
            toolbarConfig: {
                pin: true
            },
            cache: {
                enable: false
            },
            mode: 'sv',
            upload: {
                accept: 'image/*,.mp3,.mp4,.wav,.rar,.zip,.tar.gz,.7z,.apk,.iso,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.txt,.md,.xml',
                url: 'http://localhost:8080/front/file/upload',
                max: 10 * 1024 * 1024,
                linkToImgUrl: 'http://localhost:8080/front/file/upload',
                multiple: true,
                fieldName: 'file',
                // 数据转换
                format(files, responseText) {
                    const res = JSON.parse(responseText);
                    const name = files[0].name;
                    const url = res.data;
                    const result = JSON.stringify({
                        code: 0,
                        data: { errFiles: '', succMap: { [name]: url } },
                    });
                    return result;
                },
            },
        });
        this.fetchTopic();
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (
                        this.contentEditor.getValue().length === 1 ||
                        this.contentEditor.getValue() == null ||
                        this.contentEditor.getValue() === ''
                    ) {
                        alert('话题内容不可为空')
                        return false
                    }
                    if (this.ruleForm.tags == null || this.ruleForm.tags.length === 0) {
                        alert('标签不可以为空')
                        return false
                    }
                    this.ruleForm.content = this.contentEditor.getValue()
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
                this.contentEditor.setValue(value.data.content);
            });
        },
    }
}
</script>

