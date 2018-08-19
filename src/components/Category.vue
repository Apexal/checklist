<template lang="pug">
  .category
    .category-header.flex
      h2.category-name {{ name }}
      .percentage(v-if="is_current")  {{ getPercentDone(name) }}%

      .new-item(v-if="editing")
        input(type="text", @keyup.enter="$emit('add-item', name, new_item, new_count)", :placeholder="'New ' + name + ' item'", v-model="new_item")
        input(type="number", @keyup.enter="$emit('add-item', name, new_item, new_count)", value=1, min=1, max=100, v-model.number="new_count")
        button(type="button", @click="$emit('add-item', name, new_item, new_count)") Add
        a.remove-item(href="#", @click="$emit('remove-category', name)", :title="'Remove category ' + name")
          button X

    details.items(open)
      summary {{ items.length  }} total
      ul(v-if="items.length > 0")
        li.item(v-for="(item, index) in items")
          b.item-name {{ item.name }}
          
          div(v-if="editing")
            input(type="number", min=1, v-model.number="items[index].count", max=100)
            a.remove-item(href="#", @click="$emit('remove-item', name, index)", :title="'Remove ' + name + ' item ' + item.name")
              button X
          
          .item-info(v-if="!editing", :class="{ 'is-done': item.progress == item.count, 'just-viewing': !is_current }")
            span.flex.inline(v-if="is_current")
              input(v-if="item.count == 1", @change="$emit('on-progress-update', name, index, $event.target)", type="checkbox", :checked="item.progress !== 0")
              span.flex.inline(v-else)
                span.item-count {{ item.progress }}/{{ item.count }}
                input.item-progress(type="range", @change="$emit('on-progress-update', name, index, $event.target)", :value="item.progress", min=0, step=1, :max="item.count")
              span.item-done {{ item.progress == item.count ? '✅' : '❌' }}
            span.item-count(v-else, :title="`${item.count} ${item.name}`") {{ item.count }}

      p.no-items-warning(v-else) No items yet!
</template>

<script>
export default {
  name: 'category',
  props: {
    is_current: Boolean,
    editing: Boolean,
    name: String,
    items: Array
  },
  data () {
    return {
      new_item: '',
      new_count: 1
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
