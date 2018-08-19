<template lang="pug">
#checklist
  #loading(v-if="loading")
    h1 Loading list...

  .categories(v-else, :class="{ 'is-editing': editing }")
    .categories-header.flex
      h2.title {{ is_current ? '⭐ Your ' : '' }}{{ editing ? 'Editing' : ''}} {{ Object.keys(categories).length }} Categories
        small.list-total {{ totalItems }} items
      .new-category(v-show="editing")
        input(type="text", placeholder="New category", v-model="new_category", @keyup.enter="addCategory(new_category)", minlength=0, maxlength=100)
        button(type="button", @click="addCategory(new_category)") Add
    
    .links
      hr.separator(style="margin-bottom: 10px")
      router-link(to="/")
        button(title="Go back to homepage") Home
      button(v-show="!creating && saved", :title="editing ? 'View and use the list' : 'Edit the list'", @click="editing = !editing") {{ editing ? 'View' : 'Edit' }}
      button(v-show="!editing && !creating && !is_current", @click="setCurrent") Track Progress
      button.warning(v-show="!saved", @click="saveToFirebase") Save
      hr.separator(style="margin-top: 10px")

    details.help(open)
      summary Help

      p(v-if="!is_current && !editing") You are viewing someone else's list. If you want to use this list click #[b TRACK PROGRESS].
      p(v-else-if="editing") Add/remove categories and items then save your list as a new one.
      p(v-else) Use the sliders and checkboxes to track what you have packed.  Click the #[b $] to toggle whether you are #[b buying an item locally once you arrive].

    div(v-if="Object.keys(categories).length > 0")
      Category(v-for="(items, name) in categories", 
        :key="name",
        :editing="editing",
        :is_current="is_current",
        :name="name",
        :items="items",
        @add-item="addItem",
        @remove-item="removeItem",
        @toggle-buying="toggleBuying"
        @on-progress-update="onProgressUpdate",
        @remove-category="removeCategory")
    p.no-categories-warning(v-else) {{ editing ? 'Add a category above to start!' : 'This checklist is empty!' }}
</template>

<script>
import Vue from 'vue';

import db from '../firebase.js';

import Category from '../components/Category.vue';

export default {
  name: 'checklist',
  components: {
    Category
  },
  firebase: {
    checklists: db.ref('/lists'),
  },
  data () {
    return {
      key: this.$route.params.key,
      is_current: false,
      creating: false,
      loading: true,
      editing: false,
      new_category: '',
      categories: {},
      original: null
    }; 
  },
  created () {
    this.load();
  },
  methods: {
    onProgressUpdate (category, itemIndex, target) {
      if (this.is_current) {
        if (target.type === 'checkbox')
          this.categories[category][itemIndex].progress = (target.checked ? 1 : 0);
        else 
          this.categories[category][itemIndex].progress = parseInt(target.value);

        this.saveCurrentToLocalStorage();
      }
    },
    load () { 
      if (this.key !== 'create') {
        this.is_current = this.key === localStorage.getItem('checklist-key');

        if (this.is_current) {
          this.loadFromLocalStorage();
        } else {
          this.loadFromFirebase(this.key);
        }
      } else {
        this.editing = true;
        this.creating = true;
        this.loading = false;
      }
    },
    async saveToFirebase () {
      if (!confirm('This will save as a new list.')) return;

      const new_ref = await this.$firebaseRefs.checklists.push(JSON.parse(this.encoded));
      alert('Saved! Share the URL to let others use the list.');
      this.$router.push({ path: `/checklist/${new_ref.key}`});

      this.key = new_ref.key;
      this.is_current = true;
      this.saveCurrentToLocalStorage();
      this.original = this.encoded;
      this.creating = false;
    },
    loadFromFirebase (key) {
      this.$firebaseRefs.checklists.child(key).once('value', snapshot => {
        if (!snapshot.exists()) return this.$router.push({ path: '/' })
        
        this.setCategories(snapshot.val());
        this.loading = false;
        this.original = this.encoded;
      });
    },
    loadFromLocalStorage () {
      this.setCategories(JSON.parse(localStorage.getItem('checklist-categoriesJSON')));
      this.loading = false;
      this.original = this.encoded;
    },
    setCurrent () {
      if (!confirm('Use this checklist? Your progress will only be saved for this one until you choose another.')) return;

      this.is_current = true;
      this.saveCurrentToLocalStorage();
    },
    saveCurrentToLocalStorage () {
      localStorage.setItem('checklist-key', this.key);
      localStorage.setItem('checklist-categoriesJSON', JSON.stringify(this.categories));
    },
    setCategories (categories) {
      for(const category_name in categories) {
        // Account for any null items due to direct Firebase item deletions
        categories[category_name] = categories[category_name].filter(item => item !== null);

        Vue.set(this.categories, category_name, categories[category_name]);
      }
    },
    addCategory (category_name) {
      category_name = category_name.trim();

      // Validate
      if (category_name.length == 0 || category_name.length > 100 ||Object.keys(this.categories).includes(category_name)) return;

      Vue.set(this.categories, category_name, []);

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
    toggleBuying (category, itemIndex) {
      if (this.is_current) {
        const prev = this.categories[category][itemIndex].progress;
        this.categories[category][itemIndex].progress = prev == -1 ? 0 : -1;
        this.saveCurrentToLocalStorage();
      }
    },
    getCategoryTotal (category) {
      return this.categories[category].reduce((total, item) => total + item.count, 0);
    },
    changedProgress () {
      return (this.original === this.encoded) && (localStorage.getItem('checklist-categoriesJSON') !== JSON.stringify(this.categories));
    }
  },
  computed: {
    encoded () {
      const data = JSON.parse(JSON.stringify(this.categories));
      for(let key in data) {
        data[key].forEach(item => item.progress = 0);
      }
      return JSON.stringify(data);
    },
    totalItems () {
      return Object.keys(this.categories).reduce((acc, cat) => acc + this.getCategoryTotal(cat), 0)
    },
    saved () {
      return this.original === this.encoded;
    }
  }
}
</script>

<style  lang="scss">
.title {
  margin-bottom: 5px;
}

.help {
  background-color: rgb(238, 101, 101);
  color: white;
  border-radius: 5px;
  text-align: left;
  padding: 5px 15px;
  margin-bottom: 10px;

  summary {
    font-weight: bold;
  }

  p {
    margin-top: 5px;
    margin-bottom: 5px;
  }
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

      small.list-total {
        margin-left: 5px;
        color: #a5b6c7;
      }
    }

    margin-bottom: 10px;
  }

  .remove-item button {
    background-color: darkred;
    padding-left: 8px !important;
    padding-right: 8px !important;
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
