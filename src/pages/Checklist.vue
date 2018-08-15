<template lang="pug">
#checklist-creator
  .categories(:class="{ 'is-editing': editing }")
    .categories-header
      h1.title {{ Object.keys(categories).length }} Categories
      .new-category(v-show="editing")
        input(type="text", placeholder="New category", v-model="new_category", @keyup.enter="addCategory(new_category)", minlength=0, maxlength=100)
        button(type="button", @click="addCategory(new_category)") Add Category
  
    details.category(open, v-for="(value, key) in categories")
      summary.category-header
        h2.category-name {{ key }}
          span.category-total {{ getCategoryTotal(key) }} total
        .new-item(v-show="editing")
          input(type="text", :placeholder="'New ' + key + ' item'", v-model="new_items[key]")
          input(type="number", value=1, min=1, max=100, v-model.number="new_counts[key]")
          button(type="button", @click="addItem(key, new_items[key], new_counts[key])") Add Item
      
      .items
        ul(v-if="categories[key].length > 0")
          li.item(v-for="item, index in categories[key]")
            b.item-name {{ item.name }}
            
            div(v-if="editing")
              input(type="number", min=0, v-model.number="categories[key][index].count", max=100)
              a.remove-item(href="#", @click="removeItem(key, index)") X
            .item-info(v-else, :class="{ 'is-done': item.progress == item.count }")
              span.item-count {{ item.progress + ' / ' + item.count }}
              input.item-progress(type="range", v-model="categories[key][index].progress", value=0, min=0, step=1, :max="item.count")
              span.item-done {{ item.progress == item.count ? '✅' : '❌' }}
        p.no-items-warning(v-else) No items yet!


  //p
    code {{ encoded }}
  
  router-link(to="/")
    button Home
  router-link(:to="{ path: '/checklist/' + (editing ? 'view' : 'create'), query: { list: encoded } }")
    button {{ editing ? 'View' : 'Edit' }}
</template>

<script>
import Vue from 'vue';

export default {
  name: 'checklist',
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

      this.categories[category].push({ name, count, progress: 0 });
      this.new_items[category] = '';
      this.new_counts[category] = 1;
    },
    removeItem (category, itemIndex) {
      this.categories[category].splice(itemIndex, 1);
    },
    getCategoryTotal (category) {
      return this.categories[category].reduce((total, item) => total + item.count, 0);
    }
  },
  computed: {
    editing () { return this.$route.params.action == 'create'; },
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
  margin-top: 30px;
  max-width: 600px;

  .categories-header {
    display: flex;
    align-items: center;

    .title {
      flex: 1;
      text-align: left;
      margin: 0;
    }

    margin-bottom: 10px;
  }

  .category {
    .category-header {
      background-color: #8fda8d;
      border-radius: 10px 10px 0 0;
      padding: 10px;
      padding-top: 10px;
      padding-bottom: 15px;
      color: white;

      display: flex;
      align-items: center;

      .category-name {
        flex: 1;
        margin: 0;
        text-align: left;
      }

      .category-total {
        margin-left: 7px;
        font-size: 0.8em;
        color: white;
      }
    }
    .items {
      border: 1px solid #8fda8d;
      border-top: 1px solid #8fda8d;

      > ul {
        padding-left: 20px;
      }

      .item {
        display: flex;

        .item-name {
          flex: 1;
          margin-right: 10px;
          text-align: left;
        }

        .remove-item {
          margin-left: 5px;
          margin-right: 5px;
        }

        .item-info {
          .item-count {
            flex: 1;
          }
          .item-progress {
            flex: 1;
          }

          .item-done {
            font-size: 1.4em;
            color: red;
          }
        }

        .is-done {
          .item-count {
            color: #8fda8d;
            font-weight: bold;
          }

          .item-done {
            color: #8fda8d;
          }
        }
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

.categories.is-editing {
  .category-header {
    background-color: #a5b6c7;
    .category-total {
      color: #68829c;
    }
  }

  .items {
    border: 1px solid #a5b6c7;
    border-top: 1px solid #a5b6c7;

    .item-count {
      text-align: left;
    }
  }
}
</style>
