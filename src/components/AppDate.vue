<template>
  <span :title="fullDate">
    {{ diffForHumans }}
  </span>
</template>
<script>
// date functionality
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedDates from 'dayjs/plugin/localizedFormat'

dayjs.extend(relativeTime)
dayjs.extend(localizedDates)

export default {
  props: {
    timestamp: {
      required: true,
      type: [Number, Object]
    }
  },
  computed: {
    normalizedTimeStamp () {
      return this.timestamp?.seconds || this.timestamp
    },
    diffForHumans () {
      return dayjs.unix(this.timestamp).fromNow()
    },
    fullDate () {
      return dayjs.unix(this.timestamp).format('llll')
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
