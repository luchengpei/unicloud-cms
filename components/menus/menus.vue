<template>
	<el-menu class="menu-nav" default-active="index" background-color="#20222A" text-color="#fff" active-text-color="#00ffff"
	 :collapse="isCollapse">
		<el-menu-item @click="openPage(item.index)" v-if="!item.children" v-for="item in menus" :index="item.index" :key="item.index" v-show="item.show">
			<i :class="item.icon"></i>
			<span slot="title">{{item.name}}</span>
		</el-menu-item>
		<el-submenu v-else :index="item.index" :key="item.index">
			<template slot="title">
				<i :class="item.icon"></i>
				<span slot="title">{{item.name}}</span>
			</template>
			<el-menu-item @click="openPage(children.index)" v-for="children in item.children" :index="children.index" :key="children.index">{{children.name}}</el-menu-item>
		</el-submenu>
	</el-menu>
</template>

<script>
	let user = uni.getStorageSync('user');
	export default {
		props: ['isCollapse','user'],
		data() {
			return {
				menus: [{
						name: '系统首页',
						index: 'index',
						icon: 'el-icon-s-home',
						show:true
					},
					{
						name: '文章管理',
						index: 'Category',
						icon: 'el-icon-document-copy',
						show:true,
						children:[
							{
								name: '文章分类',
								index: 'Category',
							},
							{
								name:'文章列表',
								index:'articleList'
							}
						]
					}
				]
			}
		},
		methods: {
			openPage(page) {
				this.$emit('openPage', page)
			}
		}
	}
</script>

<style lang="less" scoped>
	.el-menu {
		border: none;
	}

	.menu-nav:not(.el-menu--collapse) {
		width: 200px;
		min-height: 400px;
	}
</style>
