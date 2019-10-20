import {StyleSheet, Platform} from 'react-native';

const weights = [
  'Bold',
  'ExtraLight',
  'Light',
  'Medium',
  'Regular',
  'Bold',
  'Thin',
];

export const yellow = '#f0a85e';
export const darkBlue = '#28223e';
export const lightBlue = '#696478';
export const white = '#fbf3e4';
export const darkestBlue = '#25203b';
export const tropical = '#f1ba91';
export const tropicalDark = '#e86d4b';
export const tropicalLight = '#ea8666';
import getFont from './fonts/getFont';

const categoryColors = {
  desenvolvimento: '#b1e8ed',
  arquitetura: '#94ceca',
  'python-para-tudo': '#f5bc8b',
  'data-science': '#ddb6c6',
  pessoas: '#e5e5e5',
  default: 'gray',
};

const categories = StyleSheet.create(
  Object.keys(categoryColors).reduce(
    (categories, category) => ({
      ...categories,
      [category]: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 2,
        paddingRight: 5,
        paddingBottom: 2,
        paddingLeft: 5,
        borderRadius: 2,
        marginLeft: 5,
        backgroundColor: categoryColors[category],
      },
    }),
    {
      text: {
        textAlign: 'center',
        ...getFont(),
        fontSize: 10,
        color: '#102e46',
      },
    },
  ),
);

const body = {
  flex: 1,
  padding: 10,
  height: '100%',
  backgroundColor: darkestBlue,
  ...getFont(),
};

const author = {
  color: tropicalLight,
  ...getFont(),
  fontSize: 14,
};

const authorTitle = {
  color: 'hsla(48,29%,97%,.6)',
  ...getFont('Light'),
  fontWeight: '100',
  fontSize: 14,
  paddingBottom: 8,
};

const title = StyleSheet.create({
  text: {
    flex: 1,
    color: darkBlue,
    fontSize: 16,
    ...getFont('Bold'),
    fontWeight: 'bold',
  },
  container: {
    width: '100%',
    paddingBottom: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
});

const footer = StyleSheet.create({
  container: {
    ...title.container,
    paddingBottom: 0,
  },
});

const fixedEventTitle = {
  ...title.text,
  color: yellow,
};

const dateSeparator = {
  padding: 40,
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

const dateSeparatorText = {
  ...getFont('Bold'),
  color: darkestBlue,
  fontSize: 30,
  flex: 1,
  textAlign: 'center',
};

const dateSeparatorLine = {
  width: 100,
  height: 15,
  backgroundColor: tropicalLight,
  borderRadius: 8,
  marginTop: 10,
};

const scheduleInfo = {
  flex: 1,
  paddingLeft: 35,
  paddingRight: 15,
  marginBottom: 20,
};

const scheduleContainer = {
  flex: 1,
  flexDirection: 'row',
  flexWrap: 'nowrap',
};

const dayContainer = {
  flex: 1,
};

const flexOne = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
};

const eventContainer = {
  flex: 1,
  paddingBottom: 20,
  paddingLeft: 0,
  paddingRight: 10,
  backgroundColor: white,
  justifyContent: 'flex-start',
};
const eventContainerFavorite = {
  ...eventContainer,
};

const timelineIllustration = StyleSheet.create({
  container: {
    marginTop: 3,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 999,
    backgroundColor: white,
  },
  ball: {
    width: 16,
    height: 16,
    borderRadius: 8,

    marginBottom: 3,
    backgroundColor: tropicalLight,
  },
  line: {
    backgroundColor: tropicalLight,
    flex: 1,
    width: 1,
  },
});

const time = StyleSheet.create({
  container: {
    paddingLeft: 5,
    backgroundColor: white,
    zIndex: 999,
    alignItems: 'flex-end',
  },
  text: {
    ...getFont('Bold'),
    fontWeight: 'bold',
    color: tropicalLight,
    fontSize: 16,
  },
});

const emptyMessage = StyleSheet.create({
  container: {
    width: '100%',
    alignContent: 'center',
    marginTop: 20,
  },
  text: {
    ...getFont('Bold'),
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    color: darkBlue,
  },
});

const location = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
    flex: 1,
  },
  text: {
    paddingLeft: 5,
    color: lightBlue,
    fontSize: 12,
    ...getFont('Bold'),
    textTransform: 'uppercase',
  },
});

const dayMenu = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    backgroundColor: darkBlue,
    borderRadius: 50,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    height: 50,
    paddingLeft: 8,
    paddingRight: 8,
  },
  text: {
    ...getFont('Bold'),
    fontWeight: 'bold',
    fontSize: 22,
    color: white,
    textAlign: 'center',
  },
  textHighlight: {
    ...getFont('Bold'),
    fontWeight: 'bold',
    fontSize: 22,
    color: yellow,
    textAlign: 'center',
  },
  textDisabled: {
    ...getFont('Bold'),
    fontWeight: 'bold',
    fontSize: 22,
    color: white,
    opacity: 0.5,
    textAlign: 'center',
  },
});

const schedulePage = StyleSheet.create({
  container: {
    ...body,
    padding: 0,
  },
  header: {
    backgroundColor: tropical,
    padding: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  scrollView: {
    flex: 1,
    backgroundColor: white,
  },
});

const filters = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 5,
  },
  searchIcon: {
    paddingRight: 10,
  },
  inputContainer: {
    position: 'relative',
    backgroundColor: white,
    borderRadius: 15,
    paddingLeft: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    ...(Platform.OS === 'android' && {height: 30}),
  },
  input: {
    flex: 1,
    color: lightBlue,
    fontSize: 16,
    height: 30,
    ...getFont('Light'),
  },
  ...(Platform.OS === 'android' && {
    input: {
      position: 'absolute',
      bottom: -5,
      left: 30,
      width: '90%',
      color: lightBlue,
      fontSize: 14,
      height: 40,
    },
  }),
  button: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 11,
    color: darkBlue,
    paddingLeft: 15,
    paddingRight: 15,
    ...getFont(),
  },
});

const filtersModal = StyleSheet.create({
  wrapper: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    ...title.text,
    flex: 0,
    padding: 10,
    textAlign: 'center',
    color: white,
  },
  container: {
    borderRadius: 4,
    backgroundColor: `${darkestBlue}CC`,
    margin: 'auto',
    padding: 10,
  },
  footer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: darkBlue,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  checkboxContainer: {
    padding: 5,
  },
  checkbox: {
    height: 30,
    borderRadius: 25,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: yellow,
    justifyContent: 'center',
    borderColor: yellow,
    borderWidth: 1,
  },
  checkboxEmpty: {
    height: 30,
    borderRadius: 25,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: yellow,
    justifyContent: 'center',
    borderWidth: 1,
  },
  checkboxText: {
    ...getFont('Bold'),
    fontWeight: 'bold',
    fontSize: 16,
    color: white,
    textAlign: 'center',
  },
  checkboxTextEmpty: {
    ...getFont('Bold'),
    fontWeight: 'bold',
    fontSize: 16,
    color: yellow,
    textAlign: 'center',
  },
  group: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

const absolute = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

const emptyList = StyleSheet.create({
  container: {
    flex: 0.5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: lightBlue,
    fontSize: 20,
    textAlign: 'center',
  },
});

const errorMessage = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: lightBlue,
    fontSize: 20,
    textAlign: 'center',
  },
  button: {
    padding: 20,
    backgroundColor: white,
    borderRadius: 40,
  },
  buttonText: {
    fontSize: 20,
    ...getFont('Bold'),
    fontWeight: 'bold',
    textAlign: 'center',
    color: darkBlue,
  },
});

const tableHeader = StyleSheet.create({
  wrapper: {
    padding: 10,
  },
  wrapperFooter: {
    padding: 10,
    paddingBottom: 80,
  },
  container: {
    borderRadius: 5,
    padding: 5,
    backgroundColor: tropical,
  },
  text: {
    ...getFont('Bold'),
    fontWeight: 'bold',
    color: darkBlue,
    fontSize: 16,
    textAlign: 'center',
  },
});

const eventDetails = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
  },
  container: {
    flex: 1,
  },
  badge: {
    paddingLeft: 6,
  },
});

const swipe = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  text: {
    textTransform: 'uppercase',
    paddingRight: 10,
    fontSize: 12,
    ...getFont('Bold'),
    fontWeight: 'bold',
    color: darkBlue,
  },
  listItem: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSwipeItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 20,
  },
});

const now = StyleSheet.create({
  eventsWrapper: {
    flexDirection: 'row',
  },
  dateSeparator: {
    ...dateSeparator,
    padding: 20,
    alignItems: 'flex-start',
  },
  timeWrapper: {
    paddingLeft: 5,
    paddingRight: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    justifyContent: 'flex-end',
  },
  timeText: {
    ...getFont('Bold'),
    fontWeight: 'bold',
    fontSize: 25,
    lineHeight: 25,
    color: tropicalLight,
    textAlign: 'right',
  },
  eventsContainer: {
    flex: 1,
  },
  line: {
    ...timelineIllustration.line,
  },
  buttonContainer: {
    padding: 40,
    paddingBottom: 120,
  },
  button: {
    padding: 20,
    backgroundColor: darkBlue,
    borderRadius: 40,
  },
  buttonText: {
    fontSize: 20,
    ...getFont('Bold'),
    fontWeight: 'bold',
    textAlign: 'center',
    color: white,
  },
});

const logo = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
  },
  image: {width: 250, height: 250 / 2.3553370787},
});

export default {
  ...StyleSheet.create({
    body,
    author,
    authorTitle,
    dateSeparator,
    dateSeparatorText,
    dateSeparatorLine,
    scheduleInfo,
    fixedEventTitle,
    scheduleContainer,
    dayContainer,
    eventContainer,
    eventContainerFavorite,
    absolute,
    flexOne,
  }),
  title,
  emptyMessage,
  categories,
  timelineIllustration,
  time,
  location,
  dayMenu,
  eventDetails,
  schedulePage,
  footer,
  filters,
  filtersModal,
  emptyList,
  tableHeader,
  swipe,
  now,
  logo,
  errorMessage,
};
