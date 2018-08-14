<template lang="pug">
#checklist-creator
  h1.title Create New Checklist

  .categories
    input(type="text", placeholder="New category", v-model="new_category", @keyup.enter="addCategory(new_category)", minlength=0, maxlength=100)
    button(type="button", @click="addCategory(new_category)") Add Category
  
    details.category(open, v-for="(value, key) in categories")
      summary.category-header
        h2.category-name {{ key }}
          span.category-total {{ getCategoryTotal(key) }} total
        .new-item
          input(type="text", :placeholder="'New ' + key + ' item'", v-model="new_items[key]")
          input(type="number", value=1, min=1, max=100, v-model.number="new_counts[key]")
          button(type="button", @click="addItem(key, new_items[key], new_counts[key])") Add Item
      
      .items
        ul(v-if="categories[key].length > 0")
          li(v-for="item in categories[key]")
            b.item-name {{ item.name }}
            span.item-count {{ item.count }}
        p.no-items-warning(v-else) No items yet!


  p
    code {{ encoded }}
  
  router-link(to="/") Home
  router-link(:to="{ path: '/checklist/create', query: { list: encoded } }") View
</template>

<script>
import Vue from 'vue';

export default {
  name: 'checklist-creator',
  data () {
    return {
      new_category: '',
      new_items: {},
      new_counts: {},
      categories: {}
    }; 
  },
  created () {
    if (this.$route.query.list) {
      const decoded = JSON.parse(decodeURI(this.$route.query.list));
    
      for(const category_name in decoded) {
        
        Vue.set(this.categories, category_name, decoded[category_name]);
        Vue.set(this.new_items, category_name, '');
        Vue.set(this.new_counts, category_name, 1);
      }
    }
  },
  methods: {
    addCategory (category_name) {
      category_name = category_name.trim();
      
      // Validate
      if (category_name.length == 0 || category_name.length > 100 ||Object.keys(this.categories).includes(category_name)) return;
      
      Vue.set(this.categories, category_name, []);
      Vue.set(this.new_items, category_name, '');
      Vue.set(this.new_counts, category_name, 1);

      // Empty input
      this.new_category = '';
    },
    addItem (category, name, count) {
      // Validate
      name = name.trim();
      if (count < 1 || count > 100) return;
      if (name.length == 0 || name.length > 100) return;

      this.categories[category].push({ name, count });
      this.new_items[category] = '';
      this.new_counts[category] = 1;
    },
    getCategoryTotal (category) {
      return this.categories[category].reduce((total, item) => total + item.count, 0);
    }
  },
  computed: {
    encoded () { return JSON.stringify(this.categories); }
  }
}
</script>

<style scoped lang="scss">
.title {
  margin-bottom: 5px;
}

.categories {
  margin: 0 auto;
  max-width: 600px;

  .category {
    .category-header {
      background-color: #a5b6c7;
      border-radius: 10px 10px 0 0;
      padding: 10px;
      padding-top: 10px;
      padding-bottom: 15px;
      color: white;

      display: flex;

      .category-name {
        flex: 1;
        margin: 0;
        text-align: left;
      }

      .category-total {
        margin-left: 7px;
        font-size: 0.8em;
        color: #68829c;
      }
    }
    .items {
      border: 1px solid #68829c;
      border-top: 1px solid #a5b6c7;
      .item-name {
        margin-right: 10px;
      }

      .no-items-warning {
        margin: 10px;
        font-style: italic;
        color: #68829c;
      }
    }

    margin-bottom: 40px;
  }
}
</style>
