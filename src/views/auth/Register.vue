<template>
    <div class="columns py-6">
        <div class="column is-half is-offset-one-quarter">
            <el-card shadow="never">
                <div slot="header" class="has-text-centered has-text-weight-bold">
                    新用户入驻
                </div>
                <div>
                    <el-form
                        ref="ruleForm"
                        v-loading="loading"
                        :model="ruleForm"
                        status-icon
                        :rules="rules"
                        label-width="100px"
                        class="demo-ruleForm"
                    >
                        <el-form-item label="账号" prop="username">
                            <el-input v-model="ruleForm.username"/>
                        </el-form-item>

                        <el-form-item label="密码" prop="pass">
                            <el-input
                                v-model="ruleForm.pass"
                                type="password"
                                autocomplete="off"
                            />
                        </el-form-item>

                        <el-form-item label="确认密码" prop="checkPass">
                            <el-input
                                v-model="ruleForm.checkPass"
                                type="password"
                                autocomplete="off"
                            />
                        </el-form-item>

                        <el-form-item label="邮箱" prop="email">
                            <el-row>
                                <el-input v-model="ruleForm.email" autocomplete="off" style="width: 230px"/>
                                &nbsp;
                                <el-button v-if="isShow" type="primary" @click="sendCode()"
                                class="sendCode">发送验证码</el-button>
                                <el-button v-if="!isShow" type="info" plain><span>{{count}}</span> 秒后再次发送</el-button>
                            </el-row>
                        </el-form-item>

                        <el-form-item label="邮箱验证码" prop="code">
                            <el-input v-model="ruleForm.code" autocomplete="off" style="width: auto"/>
                        </el-form-item>

                        <el-form-item>
                            <el-button
                                type="primary"
                                @click="submitForm('ruleForm')"
                            >立即注册
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
import {register, sendCode} from '@/api/auth/auth'

export default {
    name: 'Register',
    data() {
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.ruleForm.pass) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            isShow: true,
            count: 0,
            loading: false,
            ruleForm: {
                username: '',
                pass: '',
                checkPass: '',
                email: '',
                code: ''
            },
            rules: {
                username: [
                    {required: true, message: '请输入账号', trigger: 'blur'},
                    {
                        min: 2,
                        max: 10,
                        message: '长度在 2 到 10 个字符',
                        trigger: 'blur'
                    }
                ],
                pass: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {
                        min: 6,
                        max: 20,
                        message: '长度在 6 到 20 个字符',
                        trigger: 'blur'
                    }
                ],
                checkPass: [
                    {required: true, message: '请再次输入密码', trigger: 'blur'},
                    {validator: validatePass, trigger: 'blur'}
                ],
                email: [
                    {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                    {
                        type: 'email',
                        message: '请输入正确的邮箱地址',
                        trigger: ['blur', 'change']
                    }
                ],
                code: [
                    {required: true, message: '请输入邮箱验证码', trigger: 'blur'},
                    {
                        min: 6,
                        max: 6,
                        message: '请输入正确的邮箱验证码',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true
                    register(this.ruleForm)
                        .then((value) => {
                            const {code, message} = value
                            if (code === 200) {
                                this.$message({
                                    message: '账号注册成功',
                                    type: 'success'
                                })
                                setTimeout(() => {
                                    this.loading = false
                                    this.$router.push({path: this.redirect || '/login'})
                                }, 0.1 * 1000)
                            } else {
                                this.$message.error('注册失败，' + message)
                            }
                        })
                        .catch(() => {
                            this.loading = false
                        })
                } else {
                    return false
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        sendCode(formName) {
            const {email} = this.ruleForm
            sendCode(email).then(response => {
                const {code} = response;
                if (code === 200) {
                    this.isShow = false;
                    this.count = 3; //赋值3秒
                    var times = setInterval(() => {
                        this.count--; //递减
                        if (this.count <= 0) {
                            // <=0 变成获取按钮
                            this.isShow = true;
                            clearInterval(times);
                        }
                    }, 1000); //1000毫秒后执行
                    // 弹窗显示发送成功
                    this.$message({
                        message: '验证码发送成功',
                        type: 'success'
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
</style>
