<template>
	<el-dialog :title="title" :visible.sync="dialogVisible" width="750px">
		<el-form :model="form" :rules="rules" ref="form">
			<el-form-item label="文章标题" prop="title" label-width="110px">
				<el-input v-model="form.title" style="width: 75%;" size="small" placeholder="请输入文章标题"></el-input>
			</el-form-item>
			<el-form-item label="文章分类" prop="subTitle" label-width="110px">
				<el-select v-model="form.categoryId" placeholder="请选择文章分类" @change="categoryChange">
					<el-option v-for="(item,index) in categoryList" :key="index" :label="item.CategoryName" :value="item._id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="缩略图" prop="img" label-width="110px">
				<div class="image-box" v-if="form.img">
					<img :src="form.img" class="image">
					<i class="el-icon-delete-solid" @click="form.img = ''"></i>
				</div>
				<i v-else class="el-icon-plus image-uploader-icon" @click="uploadImage"></i>
			</el-form-item>
			<el-form-item label="文章内容" label-width="110px">
				<WangEditor v-model="form.desc" @change="getDesc" />
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import WangEditor from './WangEditor.vue'
	import { timeFormat } from 'utils/time.js'
	export default {
		name: "AticleAdd",
		components: {
			WangEditor
		},
		data() {
			return {
				dialogVisible: false,
				loading: false,
				categoryList:[],
				title:'新增文章',
				type:'add',
				form: {
					title: '',
					subTitle: '',
					category: '',
					categoryId:'',
					desc: '',
					img: ''
				},
				rules: {
					title: [{
						required: true,
						message: '请输入文章标题',
						trigger: 'change'
					}],
					category: [{
						required: true,
						message: '请选择文章分类',
						trigger: 'change'
					}],
					img: [{
						required: true,
						message: '请输入缩略图',
						trigger: 'change'
					}]
				}
			};
		},
		methods: {
			//初始化
			init(type,item) {
				if(type=='edit') {
					this.title = '编辑文章'
					this.type = 'edit'
				}else{
					this.title = '新增文章'
					this.type = 'add'
				}
				this.form = {
					title: '',
					subTitle: '',
					category: '',
					categoryId:'',
					desc: '',
					img: ''
				}
				this.dialogVisible = true
				this.loading = false
				this.$nextTick(() => {
					this.$refs.form.resetFields()
					if(item){
						this.form = item
					}
					this.getCategoryList()
				})
				
			},
			//处理分类
			categoryChange(){
				let {CategoryName,CNickname} = this.categoryList.find(category=>category._id == this.form.categoryId)
				this.form.subTitle = CategoryName+'-'+CNickname
				this.form.category = CategoryName
			},
			//获取文章分类
			getCategoryList(){
				uniCloud.callFunction({
					name:'add-article-category',
					data:{
						action:'get'
					}
				}).then(res=>{
					if(res.result.data.length){
						this.categoryList = res.result.data
					}
				})
			},
			//上传图片
			uploadImage() {
				uni.chooseImage({
					count: 1,
					success: img => {
						uniCloud.uploadFile({
							filePath: img.tempFilePaths[0],
							cloudPath: img.tempFiles[0].name,
							success: res => {
								this.form.img = res.fileID
							}
						})
					}
				})
			},
			//获取富文本内容
			getDesc(desc) {
				this.form.desc = desc
			},
			//提交
			submit() {
				this.$refs.form.validate(valid => {
					if (valid) {
						this.loading = true
						if(this.type=='add'){
							let params = {
								...this.form,
								createTime: timeFormat(new Date()),
								preViewNum: 0,
								collectionNum: 0,
								isSelect: false
							}
							this.handleRequest({action:'add',params})
						}else{
							this.handleRequest({action:'update',params:this.form,_id:this.form._id})
						}
					}
				})
			},
			//请求统一处理
			handleRequest(data={}){
				uniCloud.callFunction({
					name: 'aticle',
					data
				}).then(res => {
					this.loading = false
					this.$message({
						message: '操作成功',
						type: 'success',
						onClose:()=>{
							this.dialogVisible = false
							this.$emit('search')
						}
					})
				}).catch(err=>{
					this.loading = false
					this.$message({
						message: '操作失败',
						type: 'error'
					})
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.image-box {
		position: relative;
		width: 120px;
		height: 120px;
		margin-left: 0px;

		.image {
			width: 120px;
			height: 120px;
			position: absolute;
			left: 0;
			top: 0;
		}

		.el-icon-delete-solid {
			color: red;
			position: absolute;
			bottom: 0;
			right: 0;
			font-size: 20px;
		}
	}

	.image-uploader-icon {
		border: 1px dashed #55aaff;
		font-size: 28px;
		color: #8c939d;
		width: 120px;
		height: 120px;
		line-height: 120px;
		text-align: center;
	}
</style>
