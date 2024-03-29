import type { App } from 'vue';
import {
  create,
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NGlobalStyle,
  NScrollbar,
  NInput,
  NA,
  NP,
  NText,
  NH1,
  NH2,
  NH3,
  NH4,
  NH5,
  NH6,
  NButton,
  NButtonGroup,
  NForm,
  NFormItem,
  NCheckboxGroup,
  NCheckbox,
  NIcon,
  NIconWrapper,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NLayoutSider,
  NMenu,
  NBreadcrumb,
  NBreadcrumbItem,
  NDropdown,
  NSpace,
  NTooltip,
  NAvatar,
  NTabs,
  NTabPane,
  NCard,
  NRow,
  NCol,
  NDrawer,
  NDrawerContent,
  NDivider,
  NSwitch,
  NBadge,
  NAlert,
  NElement,
  NTag,
  NNotificationProvider,
  NProgress,
  NDatePicker,
  NGrid,
  NGridItem,
  NList,
  NListItem,
  NThing,
  NDataTable,
  NPopover,
  NPagination,
  NSelect,
  NRadioGroup,
  NRadio,
  NSteps,
  NStep,
  NInputGroup,
  NResult,
  NDescriptions,
  NDescriptionsItem,
  NTable,
  NInputNumber,
  NLoadingBarProvider,
  NModal,
  NUpload,
  NTree,
  NSpin,
  NTimePicker,
  NBackTop,
  NSkeleton,
  NSlider,
  NImage,
  NEllipsis,
  NCollapse,
  NCollapseItem,
  NCollapseTransition
} from 'naive-ui';

// 通用字体
import 'vfonts/Lato.css';
// 等宽字体
import 'vfonts/FiraCode.css';

const naive = create({
  components: [
    NMessageProvider,
    NDialogProvider,
    NConfigProvider,
    NGlobalStyle,
    NScrollbar,
    NSlider,
    NText,
    NImage,
    NEllipsis,
    NCollapse,
    NCollapseItem,
    NA,
    NP,
    NH1,
    NH2,
    NH3,
    NH4,
    NH5,
    NH6,
    NInput,
    NButton,
    NButtonGroup,
    NForm,
    NFormItem,
    NCheckboxGroup,
    NCheckbox,
    NIcon,
    NIconWrapper,
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NLayoutFooter,
    NLayoutSider,
    NMenu,
    NBreadcrumb,
    NBreadcrumbItem,
    NDropdown,
    NSpace,
    NTooltip,
    NAvatar,
    NTabs,
    NTabPane,
    NCard,
    NRow,
    NCol,
    NDrawer,
    NDrawerContent,
    NDivider,
    NSwitch,
    NBadge,
    NAlert,
    NElement,
    NTag,
    NNotificationProvider,
    NProgress,
    NDatePicker,
    NGrid,
    NGridItem,
    NList,
    NListItem,
    NThing,
    NDataTable,
    NPopover,
    NPagination,
    NSelect,
    NRadioGroup,
    NRadio,
    NSteps,
    NStep,
    NInputGroup,
    NResult,
    NDescriptions,
    NDescriptionsItem,
    NTable,
    NInputNumber,
    NLoadingBarProvider,
    NModal,
    NUpload,
    NTree,
    NSpin,
    NTimePicker,
    NBackTop,
    NSkeleton,
    NCollapseTransition
  ]
});

export function setupNaive(app: App<Element>) {
  app.use(naive);
}
