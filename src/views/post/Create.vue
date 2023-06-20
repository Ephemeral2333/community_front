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
                    <span><i class="fa fa fa-book"> 发布帖子 </i></span>
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
                            是否匿名发送：
                            <el-switch
                                v-model="ruleForm.anonymous"
                                active-text="匿名"
                                inactive-text="实名"
                            />
                        </el-form-item>

                        <el-form-item>
                            <el-button
                                type="primary"
                                @click="submitForm('ruleForm')"
                            >立即创建
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
import {savePost} from '@/api/post'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
export default {
    name: 'TopicPost',
    components: {

    },
    data() {
        return {
            contentEditor: {},
            ruleForm: {
                id: null,
                title: '', // 标题
                tags: [], // 标签
                content: '', // 内容
                anonymous: false, // 是否匿名
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
            mode: 'ir',
            //这里写上传图片或视频
            upload: {
                url: 'http://localhost:8080/front/file/upload',
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

        })
    },
    beforeDestroy() {

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
                    savePost(this.ruleForm).then((response) => {
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
            this.$refs[formName].resetFields()
            this.contentEditor.setValue('')
            this.ruleForm.tags = ''
        }
    }
}
</script>

<style>

</style>

