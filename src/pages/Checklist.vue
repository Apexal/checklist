<template lang="pug">
#checklist
  .categories(:class="{ 'is-editing': editing }")
    .categories-header.flex
      h1.title {{ editing ? 'Editing' : ''}} {{ Object.keys(categories).length }} Categories
      .new-category(v-show="editing")
        input(type="text", placeholder="New category", v-model="new_category", @keyup.enter="addCategory(new_category)", minlength=0, maxlength=100)
        button(type="button", @click="addCategory(new_category)") Add
    
    hr.separator
    router-link(to="/")
      button Home
    
    button(@click="editing = !editing") {{ editing ? 'View' : 'Edit' }}
    button(@click="saveToFirebase") Save
    hr
    
    div(v-if="Object.keys(categories).length > 0")
      .category(v-for="(value, key) in categories")
        .category-header.flex
          h2.category-name {{ key }}
          .new-item(v-if="editing")
            input(type="text", @keyup.enter="addItem(key, new_items[key], new_counts[key])", :placeholder="'New ' + key + ' item'", v-model="new_items[key]")
            input(type="number", @keyup.enter="addItem(key, new_items[key], new_counts[key])", value=1, min=1, max=100, v-model.number="new_counts[key]")
            button(type="button", @click="addItem(key, new_items[key], new_counts[key])") Add
            a.remove-item(href="#", @click="removeCategory(key)", :title="'Remove category ' + key")
              button X
          .percentage(v-else)  {{ getPercentDone(key) }}%

        details.items(open)
          summary {{ getCategoryTotal(key)  }} total
          ul(v-if="categories[key].length > 0")
            li.item(v-for="item, index in categories[key]")
              b.item-name {{ item.name }}
              
              div(v-if="editing")
                input(type="number", min=1, v-model.number="categories[key][index].count", max=100)
                a.remove-item(href="#", @click.prevent="removeItem(key, index)", :title="'Remove ' + key + ' item ' + item.name")
                  button X
              .item-info(v-else, :class="{ 'is-done': item.progress == item.count }")
                span.item-count {{ item.progress + ' / ' + item.count }}
                input.item-progress(type="range", v-model.number="categories[key][index].progress", value=0, min=0, step=1, :max="item.count")
                span.item-done {{ item.progress == item.count ? '✅' : '❌' }}
          p.no-items-warning(v-else) No items yet!
    p.no-categories-warning(v-else) {{ editing ? 'Add a category above to start!' : 'This checklist is empty!' }}

</template>

<script>
import Vue from 'vue';

import db from '../firebase.js';

export default {
  name: 'checklist',
  firebase: {
    checklists: {
      source: db.ref('/lists'),
      readyCallback () {
        // eslint-disable-next-line
        console.log('Loaded data from Firebase...');
      }
    }
  },
  data () {
    return {
      key: this.$route.params.key,
      editing: false,
      new_category: '',
      new_items: {},
      new_counts: {},
      categories: {}
    }; 
  },
  created () {
    if (this.key !== 'create')
      this.loadFromFirebase(this.key);
    else
      this.editing = true;
  },
  methods: {
    async saveToFirebase () {
      const new_ref = await this.$firebaseRefs.checklists.push(JSON.parse(this.encoded));
      alert('Saved! Share the URL to let others use the list.');
      this.$router.push({ path: `/checklist/${new_ref.key}`});
    },
    loadFromFirebase (key) {
      this.$firebaseRefs.checklists.child(key).once('value', snapshot => {
        this.categories = snapshot.val();
      });
    },
    setCategories (categories) {
      for(const category_name in categories) { 
        Vue.set(this.categories, category_name, categories[category_name]);
        Vue.set(this.new_items, category_name, '');
        Vue.set(this.new_counts, category_name, 1);
      }
    },
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
    removeCategory (category) {
      Vue.delete(this.categories, category);
    },
    getPercentDone (category) {
      const total = this.getCategoryTotal(category);
      const have = this.categories[category].reduce((total, item) => total + item.progress, 0);
      return Math.round((have / total) * 100);
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

  .remove-item button {
    background-color: darkred;
    padding-left: 8px !important;
    padding-right: 8px !important;
  }

  .category {
    .category-header {
      background-color: #42b883;
      border-radius: 10px 10px 0 0;
      padding: 10px;
      color: white;

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
      border: 1px solid #42b883;
      border-top: 1px solid #42b883;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;

      > ul {
        padding-left: 10px;
        padding-right: 10px;
        margin: 5px 0;
      }

      .item {
        display: flex;
        align-items: center;

        .item-name {
          flex: 1;
          text-align: left;
        }

        .remove-item {
          button {
            padding-left: 10px;
            padding-right: 10px;
          }
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
            color: #42b883;
            font-weight: bold;
          }

          .item-done {
            color: #42b883;
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

.categories .category:last-child {
  margin-bottom: 0;
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
