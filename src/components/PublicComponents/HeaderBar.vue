<template>
    <div class="HeaderBar">
    <el-row
     align="middle" justify="space-around" style="width:100%;" type="flex"
    >
        <el-col>
            <a href="/">
                <img src="@/assets/img/logo.png">
            </a>
        </el-col>
        <el-col>
            <el-input
             v-model="params.keyword" class="input-with-select" placeholder="搜索作品" :debounce="300" :maxlength="30"
            >
                <el-select v-model="params.illustType" slot="prepend">
                    <el-option
                     v-for="item of typeList" :key="item.value" :label="item.name" :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-input>
        </el-col>

        <el-col>
            <div @click="userOpen">
                <el-avatar icon="el-icon-user-solid" fit="cover" shape="square"></el-avatar>
            </div>
            
        </el-col>
        <!-- 个人中心预留 -->
    </el-row>
    </div>
</template>

<script>
export default {
    name: 'HeaderBar',
    data() {
        return {
            user: 'd',
            params: {
                keyword: '',
                illustType: 'illust'
            },
            typeList: [
                {
                    name: '插图',
                    value: 'illust'
                },
                {
                    name: '漫画',
                    value: 'manga'
                },
                {
                    name: '作者',
                    value: 'artist'
                }
            ]
        }
    },
    methods: {
        userOpen() {
            this.$store.dispatch('setLoginBoolean');
            // if (!cookieTool.get('jwt')) {
            //     this.$store.dispatch('setLoginBoolean');
            // }
        }
    }
}
</script>

<style scoped lang="less">
     .HeaderBar {
        background-color: #123;
        height: 100%;
        width: 100%;
        display: flex;
        overflow: hidden;
        /deep/.el-select .el-input {
            width: 80px;
        }
        /deep/.input-with-select {
            width: 30vw;
            background-color: #fff;
        }

        .input-with-select {
            border-radius: 0px;
        }

        .input-with-select:hover {
            background-color: rgba(3, 245, 36, 0.884);
        }
        
        .header-info {
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
    }

</style>