
/**
 * 设置表单垂直布局样式
 * @param sm {Number} <576px
 * @param md {Number} ≥768px
 * @param lg {Number} ≥992px
 * @param xl {Number} ≥1200px
 * @param xxl {Number} ≥1600px
 * @returns {*}
 */
export const setFormVerticalLayout = (sm, md, lg, xl, xxl) => ({
  formItemLayout: {
    labelCol: {
      xs: { span: 24 },
      sm: { span: sm },
      md: { span: md },
      lg: { span: lg },
      xl: { span: xl },
      xxl: { span: xxl },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 - sm },
      md: { span: 24 - md },
      lg: { span: 24 - lg },
      xl: { span: 24 - xl },
      xxl: { span: 24 - xxl },
    },
  },
  tailFormItemLayout: {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 24 - sm, offset: sm },
      md: { span: 24 - md, offset: md },
      lg: { span: 24 - lg, offset: lg },
      xl: { span: 24 - xl, offset: xl },
      xxl: { span: 24 - xxl, offset: xxl },
    },
  },
});
