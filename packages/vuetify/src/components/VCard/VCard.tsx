/* eslint-disable complexity */

// Styles
import './VCard.sass'

// Components
import { VAvatar } from '@/components/VAvatar'
import { VImg } from '@/components/VImg'
import { VCardActions } from './VCardActions'
import { VCardHeader } from './VCardHeader'
import { VCardSubtitle } from './VCardSubtitle'
import { VCardText } from './VCardText'
import { VCardTitle } from './VCardTitle'

// Composables
import { makeBorderProps, useBorder } from '@/composables/border'
import { makeDensityProps, useDensity } from '@/composables/density'
import { makeDimensionProps, useDimension } from '@/composables/dimensions'
import { makeElevationProps, useElevation } from '@/composables/elevation'
import { makeLocationProps, useLocation } from '@/composables/location'
import { makePositionProps, usePosition } from '@/composables/position'
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeRouterProps, useLink } from '@/composables/router'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, provideTheme } from '@/composables/theme'
import { genOverlays, makeVariantProps, useVariant } from '@/composables/variant'
import { IconValue } from '@/composables/icons'

// Directives
import { Ripple } from '@/directives/ripple'

// Utilities
import { defineComponent } from '@/util'
import { VDefaultsProvider } from '../VDefaultsProvider'

export const VCard = defineComponent({
  name: 'VCard',

  directives: { Ripple },

  props: {
    appendAvatar: String,
    appendIcon: IconValue,
    disabled: Boolean,
    flat: Boolean,
    hover: Boolean,
    image: String,
    link: Boolean,
    prependAvatar: String,
    prependIcon: IconValue,
    ripple: Boolean,
    subtitle: String,
    text: String,
    title: String,

    ...makeThemeProps(),
    ...makeBorderProps(),
    ...makeDensityProps(),
    ...makeDimensionProps(),
    ...makeElevationProps(),
    ...makeLocationProps(),
    ...makePositionProps(),
    ...makeRoundedProps(),
    ...makeRouterProps(),
    ...makeTagProps(),
    ...makeVariantProps({ variant: 'contained' } as const),
  },

  setup (props, { attrs, slots }) {
    const { themeClasses } = provideTheme(props)
    const { borderClasses } = useBorder(props)
    const { colorClasses, colorStyles, variantClasses } = useVariant(props)
    const { densityClasses } = useDensity(props)
    const { dimensionStyles } = useDimension(props)
    const { elevationClasses } = useElevation(props)
    const { locationStyles } = useLocation(props)
    const { positionClasses } = usePosition(props)
    const { roundedClasses } = useRounded(props)
    const link = useLink(props, attrs)

    return () => {
      const Tag = (link.isLink.value) ? 'a' : props.tag
      const hasTitle = !!(slots.title || props.title)
      const hasSubtitle = !!(slots.subtitle || props.subtitle)
      const hasHeaderContent = hasTitle || hasSubtitle
      const hasAppend = !!(slots.append || props.appendAvatar || props.appendIcon)
      const hasPrepend = !!(slots.prepend || props.prependAvatar || props.prependIcon)
      const hasImage = !!(slots.image || props.image)
      const hasHeader = hasHeaderContent || hasPrepend || hasAppend
      const hasText = !!(slots.text || props.text)
      const isClickable = !props.disabled && (link.isClickable.value || props.link)

      return (
        <Tag
          class={[
            'v-card',
            {
              'v-card--disabled': props.disabled,
              'v-card--flat': props.flat,
              'v-card--hover': props.hover && !(props.disabled || props.flat),
              'v-card--link': isClickable,
            },
            themeClasses.value,
            borderClasses.value,
            colorClasses.value,
            densityClasses.value,
            elevationClasses.value,
            positionClasses.value,
            roundedClasses.value,
            variantClasses.value,
          ]}
          style={[
            colorStyles.value,
            dimensionStyles.value,
            locationStyles.value,
          ]}
          href={ link.href.value }
          onClick={ isClickable && link.navigate }
          v-ripple={ isClickable }
        >
          { hasImage && (
            <VDefaultsProvider
              defaults={{
                VImg: {
                  cover: true,
                  src: props.image,
                },
              }}
            >
              { slots.image ? slots.image?.() : <VImg /> }
            </VDefaultsProvider>
          ) }

          { slots.media?.() }

          { hasHeader && (
            <VCardHeader>
              { hasPrepend && (
                <VDefaultsProvider
                  defaults={{
                    VAvatar: {
                      density: props.density,
                      icon: props.prependIcon,
                      image: props.prependAvatar,
                    },
                  }}
                >
                  <div class="v-card__prepend">
                    { slots.prepend
                      ? slots.prepend()
                      : (<VAvatar />)
                    }
                  </div>
                </VDefaultsProvider>
              ) }

              { hasHeaderContent && (
                <>
                  { hasTitle && (
                    <VCardTitle>
                      { slots.title ? slots.title() : props.title}
                    </VCardTitle>
                  ) }

                  { hasSubtitle && (
                    <VCardSubtitle>
                      { slots.subtitle ? slots.subtitle() : props.subtitle }
                    </VCardSubtitle>
                  ) }

                  { slots.header?.() }
                </>
              ) }

              { hasAppend && (
                <VDefaultsProvider
                  defaults={{
                    VAvatar: {
                      density: props.density,
                      icon: props.appendIcon,
                      image: props.appendAvatar,
                    },
                  }}
                >
                  <div class="v-card__append">
                    { slots.append
                      ? slots.append()
                      : (<VAvatar />)
                    }
                  </div>
                </VDefaultsProvider>
              ) }
            </VCardHeader>
          ) }

          { hasText && (
            <VCardText>
              { slots.text ? slots.text() : props.text }
            </VCardText>
          ) }

          { slots.default?.() }

          { slots.actions && (
            <VCardActions v-slots={{ default: slots.actions }} />
          ) }

          { genOverlays(isClickable, 'v-card') }
        </Tag>
      )
    }
  },
})

export type VCard = InstanceType<typeof VCard>
