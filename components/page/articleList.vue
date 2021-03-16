<template>
	<div>
		<div class="h-box">
			<div class="b-box">
				<el-button type="primary" @click="handleBtn('add')">添加文章</el-button>
			</div>
		</div>
		<el-table :data="dataList" width="100%" border v-loading="loading"
			 element-loading-text="玩命正在加载中..."
			element-loading-spinner="el-icon-loading">
			<el-table-column type="index" width="50" align="center" header-align="center" label="序号">
			</el-table-column>
			<el-table-column align="center" header-align="center" label="标题" prop="title">

			</el-table-column>
			<el-table-column align="center" header-align="center" label="分类" prop="category">

			</el-table-column>
			<el-table-column prop="img" label="缩略图" width="65" header-align="center" align="center">
				<template slot-scope="scope">
					<el-popover placement="right" trigger="hover">
						<img :src="scope.row.img" style="max-height: 300px;max-width: 500px" />
						<img slot="reference" :src="scope.row.img" style="max-height: 30px;max-width: 130px">
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="_id" label="id" header-align="center" align="center">
			</el-table-column>
			<el-table-column label="操作" min-width="60" header-align="center" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="handleBtn('edit',scope.row)">编辑</el-button>
					<el-button type="text" size="small" style="color: red;" @click="del(scope.row._id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
		   <el-pagination
		     @size-change="handleSizeChange"
		     @current-change="handleCurrentChange"
		     :current-page.sync="page"
		     :page-sizes="[10, 20, 30, 100,150]"
		     :page-size="pageSize"
		     layout="total, sizes, prev, pager, next, jumper"
		     :total="total">
		   </el-pagination>
		 </div>
		<AticleAdd ref="addAticle" v-if="visible" @search="search" />
	</div>
</template>

<script>
	import AticleAdd from '../AticleAdd.vue'
	export default {
		components: {
			AticleAdd
		},
		data() {
			return {
				visible: false,
				dataList: [],
				loading: false,
				total:0,
				page:1,
				pageSize:10
			}
		},
		mounted() {
			this.search()
		},
		methods: {
			handleSizeChange(val) {
				this.pageSize = val
				this.page = 1
				this.search()
			},
			handleCurrentChange(val) {
				this.page = val
				this.search()
			},
			//搜索
			search() {
				this.loading = true
				uniCloud.callFunction({
					name: 'aticle',
					data: {
						action: 'get',
						params:{
							page:this.page,
							pageSize:this.pageSize
						}
					}
				}).then(res => {
					this.loading = false
					this.dataList = res.result.data
					this.total = res.result.total
				})
			},
			//新增编辑
			handleBtn(type, item) {
				this.visible = true;
				if(item) item = JSON.parse(JSON.stringify(item))
				this.$nextTick(() => {
					this.$refs.addAticle.init(type, item)
				})
			},
			//删除
			del(_id) {
				uniCloud.callFunction({
					name: 'aticle',
					data: {
						action: 'delete',
						_id
					},
					success: (res) => {
						this.$message({
							message: '操作成功',
							type: 'success',
							onClose: () => {
								this.search()
							}
						})
					}
				})
			}
		},
	}
</script>

<style scoped>
	.h-box {
		margin-bottom: 20px;
	}
	.block{
		position: fixed;
		bottom: 100px;
		right: 20px;
	}
</style>
