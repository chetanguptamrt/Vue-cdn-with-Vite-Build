import { getAuthHeader } from '../../../utils/authentication.util.js';
import template from './Products.template.js'
const { ref, onMounted } = Vue;
const { useRouter } = VueRouter;
import axios from '@axios';
import VueRouter from '@vue-router'
console.log('products')

export default {
    name: 'Products',

    setup() {
        const router = useRouter()
        const products = ref({
            skip: 0,
            limit: 15,
            hasMore: false,
            list: [],
            isScrollLoading: false,
            isLoading: false,
        });

        const goToAddProduct = () => router.push('/products/add')

        const getProducts = async (isScroll) => {
            try {
                if (isScroll)
                    products.value.isScrollLoading = true
                else
                    products.value.isLoading = true

                const res = await axios({
                    url: '/api/products',
                    method: 'GET',
                    params: {
                        skip: products.value.skip,
                        limit: products.value.limit,
                    },
                    headers: getAuthHeader()
                });

                products.value.hasMore = res.data.products.length === products.value.limit;
                products.value.skip += products.value.limit;

                if (isScroll) {
                    products.value.list = products.value.list.concat(res.data.products);
                } else {
                    products.value.list = res.data.products;
                }

            } catch (err) {
                console.error(err);
            } finally {
                products.value.isScrollLoading = false
                products.value.isLoading = false
            }
        }

        onMounted(() => {
            getProducts()
        })

        return {
            products,
            goToAddProduct,
            getProducts,
        }
    },
    template: template
}