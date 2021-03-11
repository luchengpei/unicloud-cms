<template>
	<div class="Category-box">
		<div class="h-box">
			<div class="b-box" @click="addCBtn()">
				<el-button type="primary">添加文章分类</el-button>
			</div>
		</div>
		<div class="table-box">
			<template>
				<el-table :data="tableData" border style="width: 100%">
					<el-table-column prop="sort" label="序号" width="50" header-align="center" align="center">
					</el-table-column>
					<el-table-column prop="CategoryName" label="文章分类名称" width="120" header-align="center" align="center">
					</el-table-column>
					<el-table-column prop="CNickname" label="文章分类简称" width="120" header-align="center" align="center">
					</el-table-column>
					<el-table-column prop="thumbnail" label="缩略图" width="65" header-align="center" align="center">
						<template slot-scope="scope">
							<el-popover placement="right" trigger="hover">
								<img :src="scope.row.thumbnail" style="max-height: 300px;max-width: 500px" />
								<img slot="reference" :src="scope.row.thumbnail" style="max-height: 30px;max-width: 130px">
							</el-popover>
						</template>
					</el-table-column>
					<!-- <el-table-column prop="Pid" label="Pid">
					</el-table-column> -->
					<el-table-column prop="_id" label="分类id" header-align="center" align="center">
					</el-table-column>
					<el-table-column prop="showOrhide" label="是否显示" width="80" header-align="center" align="center">
						<template slot-scope="scope">
							<el-switch  v-model="scope.row.showOrhide" active-color="#13ce66" inactive-color="#ff4949" @change="changeShow(scope.row)">
								
							</el-switch>
						</template>
					</el-table-column>
					<el-table-column label="操作" min-width="60" header-align="center" align="center">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
							<el-button @click.native="delCategory(scope.row._id)" type="text" size="small" style="color: red;">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</div>
		 <div class="block">
		    <el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page.sync="currentPage"
		      :page-sizes="[1, 2, 3, 10,50]"
		      :page-size="pageSize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="total">
		    </el-pagination>
		  </div>
		<CategoryAdd ref="isShowC" ></CategoryAdd>
	</div>
</template>

<script>
	import CategoryAdd from "../CategoryAdd/CategoryAdd.vue"
	export default {
		data() {
			return {
				tableData: [],
				currentPage: 1,
				pageSize: 3,
				total: 0,
			}
		},
		components: {
			CategoryAdd
		},
		mounted() {
			this.getCategory()
		},
		methods: {
			handleSizeChange(val) {
				this.pageSize = val
				this.currentPage = 1
				this.getCategory()
			},
			handleCurrentChange(val) {
				this.currentPage = val
				this.getCategory()
			},
			//添加
			addCBtn() {
				this.$refs.isShowC.initBtn();
			},
			//获取分类列表
			getCategory() {
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name:'add-article-category',
					data:{
						action:'get',
						page:this.currentPage,
						pageSize:this.pageSize
					}
				}).then(res=>{
					uniCloud.callFunction({
						name:"add-article-category",
						data:{
							action:'total'
						},
						success: (total) => {
							this.total = total.result.data.length
						}
					})
					uni.hideLoading()
					res.result.data.forEach((row,index)=>res.result.data[index].sort = index+1)
					this.tableData = res.result.data
					
				})
			},
			//是否显示
			changeShow(item){
				uniCloud.callFunction({
					name:'add-article-category',
					data:{
						action:'edit',
						params:{
							showOrhide:item.showOrhide,
							_id:item._id
						}
					}
				}).then(res=>{
					this.$message({
						type: 'success',
						message: '操作成功',
						duration: 1500
					})
				})
			},
			//编辑
			edit(item){
				this.$refs.isShowC.initBtn(item._id);
			},
			//删除
			delCategory(e) {
				uniCloud.callFunction({
					name:'add-article-category',
					data:{
						action:'delete',
						id:e
					}
				}).then(res=>{
					this.$message({
						type: 'success',
						message: '删除成功',
						duration: 800,
						offset: 200,
						onClose:()=>{
							this.getCategory()
						}
					})
				}).catch(err=>{
					this.$message({
						type: 'error',
						message: '删除失败',
						duration: 800,
						offset: 200,
					})
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.Category-box {
		background-color: #fff;

		.h-box {
			width: 100%;
			height: 75px;

			.b-box {
				position: relative;
				top: 18px;
				left: 15px;
			}
		}

		.table-box {
			width: 96%;
			margin: auto;
			margin-bottom: 20px;
		}
	}
</style>
