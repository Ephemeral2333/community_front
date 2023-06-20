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
                    <span><i class="fa fa fa-book"> 每日一句投稿 </i></span>
                </div>
                <div>
                    <el-form
                        ref="ruleForm"
                        :model="ruleForm"
                        :rules="rules"
                        class="demo-ruleForm"
                    >
                        <el-form-item prop="author">
                            <el-input
                                v-model="ruleForm.author"
                                placeholder="请输入作者"
                            />
                        </el-form-item>

                        <el-form-item prop="content">
                            <el-input
                                type="textarea"
                                :rows="18"
                                resize="none"
                                placeholder="请输入内容"
                                v-model="ruleForm.content">
                            </el-input>
                        </el-form-item>

                        <el-form-item prop="postman">
                            投稿人：
                            <el-input
                                v-model="ruleForm.postman"
                                placeholder="输入投稿人名称，也就是您想要在主页展示的名称，可以是匿名"
                                style="width: 500px;"
                            />
                        </el-form-item>

                        <el-form-item>
                            <el-button
                                type="primary"
                                @click="submitForm('ruleForm')"
                            >立即投稿
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
import {PostTip} from "@/api/tip";

export default {
    name: 'TipPost',
    components: {

    },
    data() {
        return {
            ruleForm: {
                author: '', // 标题
                content: '', // 内容
                postman: '', // 投稿人
            },
            rules: {
                author: [
                    {required: true, message: '请输入作者名称', trigger: 'blur'},
                    {
                        min: 1,
                        max: 25,
                        message: '长度在 1 到 25 个字符',
                        trigger: 'blur'
                    }
                ],
                content: [
                    {required: true, message: '请输入投稿内容', trigger: 'blur'},
                    {
                        min: 1,
                        max: 1000,
                        message: '长度在 1 到 1000 个字符',
                        trigger: 'blur'
                    }
                ],
                postman: [
                    {required: true, message: '请输入投稿人名称', trigger: 'blur'},
                    {
                        min: 1,
                        max: 25,
                        message: '长度在 1 到 25 个字符',
                        trigger: 'blur'
                    }
                ],
            }
        }
    },
    mounted() {

    },
    beforeDestroy() {

    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    PostTip(this.ruleForm).then((response) => {
                        // 提示用户投稿成功
                        this.$message({
                            message: '感谢您的投稿，请耐心等待审核，审核成功后将会以邮件的形式通知您',
                            type: 'success'
                        })
                        // 返回主页
                        this.$router.push({path: '/'})
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

