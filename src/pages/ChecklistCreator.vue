<template lang="pug">
#checklist
  h1 Create New Checklist
  input(type="text", placeholder="New category", v-model="new_category", @keyup.enter="addCategory(new_category)", minlength=0, maxlength=100)
  button(type="button", @click="addCategory(new_category)") Add Category
  ul
    li(v-for="cat, index in categories", :key="index")
      .category
        h2 {{ cat }} 
</template>

<script>
export default {
  name: 'checklist-creator',
  components: {},
  data () {
    return {
      new_category: '',
      categories: []
    }; 
  },
  methods: {
    addCategory (category) {
      category = category.trim();
      
      // Validate
      if (category.length == 0 || category.length > 100 ||this.categories.includes(category)) return;
      
      this.categories.push(category);
      
      // Empty input
      this.new_category = '';
    }
  }
}
</script>

<style scoped lang="scss">
</style>
