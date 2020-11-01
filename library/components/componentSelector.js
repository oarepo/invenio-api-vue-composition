import { computed } from '@vue/composition-api'
import SimpleErrorComponent from './SimpleErrorComponent.vue'
import EmptyLoadingComponent from './EmptyLoadingComponent.vue'

export function selectComponent (hasValue, hasError, props) {
  return computed(() => {
    if (hasValue()) {
      return props.viewerComponent
    } else if (hasError()) {
      if (props.errorComponent === 'viewer') {
        return props.viewerComponent
      } else if (props.errorComponent === 'simple' || !props.errorComponent) {
        return SimpleErrorComponent
      } else {
        return props.errorComponent
      }
    } else {
      if (props.loadingComponent === 'viewer') {
        return props.viewerComponent
      } else if (props.loadingComponent === 'simple' || !props.loadingComponent) {
        return EmptyLoadingComponent
      } else {
        return props.loadingComponent
      }
    }
  })
}
