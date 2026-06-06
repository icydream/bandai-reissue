<script setup>
import { ref, h, watch } from 'vue';
import { NDataTable, NSpace, NImage } from 'naive-ui';
import { useRoute } from 'vue-router';
import { useParamStore } from '@/stores/param';
import categoryData from '@/assets/data/category.json';

const route = useRoute();
const paramStroe = useParamStore();
const loading = ref(false);
const data = ref([]);
const pageData = ref([]);
const columns = [
    {
        title: '盒繪',
        width: 180,
        fixed: 'left',
        render(row) {
            return h(NImage, {
                src: row.cover,
                'img-props': {
                    width: '100%'
                }
            });
        }
    },
    {
        title: '品名',
        minWidth: 120,
        render(row) {
            return h('div', [row.original_title, h('br'), `(${row.title})`]);
        }
    },
    {
        title: '類別',
        key: 'category',
        minWidth: 80
    },
    {
        title: '預計到貨',
        minWidth: 80,
        render(row) {
            return h('div', (() => {
                let month = [...row.month];
                
                for(let i = 0; i < month.length; i++) {
                    if(i % 2 === 1) {
                        month = [...month.slice(0, i), h('br'), ...month.slice(i, month.length)];
                    }
                }

                return month;
            })());
        }
    },
    {
        title: '售價',
        minWidth: 200,
        render(row) {
            let price = row.price;
            
            if(!!price) {
                price = `${Number(row.price).toLocaleString('ja-JP')} 円`;
            } else {
                price = '-';
            }

            return price;
        }
    }
];
const pagination = ref({
    page: 1,
    pageSize: 20,
    itemCount: 0,
    showSizePicker: false,
    prefix({ itemCount }) {
        return `共 ${itemCount} 筆資料`
    }
});
const handlePageChange = page => {
    window.scrollTo({ top: 0, left: 0 });
    pagination.value.page = page;
    pageData.value = data.value.filter((_, i) => {
        const startIndex = pagination.value.pageSize * (page - 1);
        const endIndex = pagination.value.pageSize * page - 1;

        return startIndex <= i && i <= endIndex;
    });
}

watch(
    [
        () => route.params.period,
        () => route.query.category
    ],
    async ([period, category]) => {
        loading.value = true;

        const jsonData = await import(`@/assets/data/${period}.json`);

        paramStroe.period = period;
        data.value = jsonData.default.map(data => {
            const result = categoryData.find(c => {
                if(Array.isArray(c.key)) {
                    for(const key of c.key) {
                        if(data.title.indexOf(key) !== -1) {
                            return true;
                        }
                    }
                } else {
                    return data.title.indexOf(c.key) !== -1;
                }

                return false;
            });
            let category = '-';

            if(!!result) {
                category = result.category;
            }

            data.category = category;

            return data;
        })
        .filter(data => {
            if(!!category) {
                return data.category === category;
            }

            return true;
        });
        pagination.value.itemCount = data.value.length;
        handlePageChange(1);
        loading.value = false;
    },
    { immediate: true }
);
</script>
<template>
    <n-space item-style="width: 100%;" vertical>
        <n-data-table
            remote
            :loading="loading"
            :columns="columns"
            :data="pageData"
            :pagination="pagination"
            :scroll-x="800"
            @update:page="handlePageChange"
        />
  </n-space>
</template>