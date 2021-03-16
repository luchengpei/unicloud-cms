<template>
	<div style="position: relative;">
		<el-dialog :title="dialogName" :visible.sync="dialogFormVisible" width="500px">
			<el-form :model="form">
				<el-form-item label="文章分类名称" prop="title" label-width="110px">
					<el-input v-model="form.CategoryName" style="width: 75%;" size="small" placeholder="请输入文章分类名称"></el-input>
				</el-form-item>
				<el-form-item label="文章分类简称" prop="title" label-width="110px">
					<el-input v-model="form.CNickname" style="width: 75%;" size="small" placeholder="请输入文章分类简称"></el-input>
				</el-form-item>
				<el-form-item label="是否展示" label-width="110px">
					<el-switch v-model="form.showOrhide" active-color="#13ce66" inactive-color="#ff4949" 
					>
					</el-switch>
				</el-form-item>
				<el-form-item label="缩略图" prop="title" label-width="110px">
					<div class="image-box" v-if="article.image">
						<img :src="article.image" class="image">
						<i class="el-icon-delete-solid" @click="deleteImage"></i>
					</div>
					<i v-else class="el-icon-plus image-uploader-icon" @click="uploadImage('article')"></i>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible= false">取 消</el-button>
				<el-button type="primary" @click="addCategoryBtn">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				dialogFormVisible: false,
				dialogName: "添加分类",
				form: {
					CategoryName: "",
					CNickname: "",
					thumbnail: " ",
					showOrhide: true,
					delete_date: "0"
				},
				// value:0,
				options: [],
				article: {
					image: ""
				},
				_id:''
			}
		},
		methods: {
			initBtn(_id = '') {
				this._id = _id
				this.dialogFormVisible = true
				this.form = {
					CategoryName: "",
					CNickname: "",
					thumbnail: " ",
					showOrhide: true,
					delete_date: "0"
				}
				this.article.image = ''
				this._id&&this.getDetail(this._id)
			},
			uploadImage(type) {
				console.log(type)
				uni.chooseImage({
					count: 1,
					success: images => {
						this.uploading = true
						console.log(images.tempFiles[0].name)
						uniCloud.uploadFile({
							filePath: images.tempFilePaths[0],
							cloudPath: images.tempFiles[0].name,
							success:(res)=> {
								this.uploading = false
								if (type === 'editor') {
									this.editorCtx.insertImage({
										src: res.fileID
									})
								} else {
									console.log(res)
									this.article.image = res.fileID
									console.log(this.article.image)
								}
							}
						})
					}
				})
			},
			deleteImage() {
				this.uploading = true
				uniCloud.deleteFile({
					fileList: [this.article.image],
					complete:()=> {
						this.uploading = false
						this.article.image = ''
					}
				})
			},
			sub_caiji() {
				console.log(this.article.image)
			},

			changeBtn() {
				// if(this.options[this.value]._id){
				// 	this.form.Pid=this.options[this.value]._id
				// }else{
				// 	this.form.Pid=0
				// }
				// console.log(this.form.Pid)
			},
			//请求对应的数据
			getDetail(_id){
				this.handleRequest('detail',_id)
			},
			//统一处理新增和编辑
			handleRequest(action,form){
				uniCloud.callFunction({
					name: 'add-article-category',
					data: {
						action:action,
						params:form
					}
				}).then((res) => {
					if(action!='detail'){
						this.uploading = false
						this.dialogFormVisible = false
						// this.$parent.fatherMethodS();
						this.$message({
							showClose: true,
							message: '操作成功',
							type: 'success'
						})
					}else{
						this.form = {...this.form,...res.result.data[0]}
						this.article.image = this.form.thumbnail
					}
				})
			},
			addCategoryBtn() {
				this.form.thumbnail=this.article.image
				if (!this.form.CategoryName || !this.form.CNickname) {
					this.$message({
						showClose: true,
						message: '未填写分类名称或分类简称',
						type: 'error'
					})
					return
				}
				if (!this.article.image) {
					this.$message({
						showClose: true,
						message: '分类缩略图不能为空',
						type: 'error'
					})
					return
				}
				this.uploading = true
				let form = {
					...this.form
				}
				// if(this._id) {
				// 	uni
				// }else{
				// 	this.handleRequest('add',form)
				// }
				this._id?this.handleRequest('edit',form):this.handleRequest('add',form)
			}
		}
	}
</script>

<style lang="less" scoped>
	.dialog-box {
		width: 20%;
		margin: auto;
	}

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

	.ql-editor {
		padding: 0;
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
