<template lang="pug">
  .category
    .category-header.flex
      h2.category-name {{ name }}

    details.items(open)
      summary {{ items.length  }} total
      ul(v-if="items.length > 0")
        li.item(v-for="item, index in items")
          b.item-name {{ item.name }}
          
          .item-info.just-viewing
            span.item-count(:title="`${item.count} ${item.name}`") {{ item.count }}
      p.no-items-warning(v-else) No items yet!
</template>

<script>
export default {
  name: 'category',
  props: {
    name: String,
    items: Array
  },
  data () {
    return {
      new_item: '',
      new_count: ''
    };
  },
  methods: {
    getPercentDone () {
      return 10;
    }
  },
  computed: {
  }
}
</script>

<style scoped lang="scss">
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
      text-transform: capitalize;
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

    summary {
      background-color: #f3f3f3;
    }

    &:not([open]) summary {
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }

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
        text-transform: capitalize;
      }

      .remove-item {
        button {
          padding-left: 10px;
          padding-right: 10px;
        }
      }

      .item-info {
        &.just-viewing {
          flex: 1;
        }

        .item-count {
          flex: 1;
          margin-right: 5px;
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
</style>
