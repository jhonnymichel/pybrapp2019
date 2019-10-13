import {StyleSheet} from 'react-native';

const weights = [
  'Bold',
  'ExtraLight',
  'Light',
  'Medium',
  'Regular',
  'SemiBold',
  'Thin',
];

export const yellow = '#efc780';
export const darkBlue = '#102e46';
export const lightBlue = '#7fc7cf';
export const white = 'white';

const font = f => (weight = 'Regular') => `${f}-${weight}`;
const nunito = font('Nunito');
const adventPro = font('AdventPro');

const categoryColors = {
  dev: '#7fc7cf',
  devops: '#3a8bbb',
  web: '#f5bc8b',
  'data-science': '#ce9bc4',
  pessoas: '#8b9ffc',
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
        fontFamily: nunito(),
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
  backgroundColor: '#0D273C',
  fontFamily: adventPro(),
};

const author = {
  color: white,
  fontFamily: nunito(),
  fontSize: 14,
};

const authorTitle = {
  color: 'hsla(48,29%,97%,.6)',
  fontFamily: nunito('Light'),
  fontSize: 14,
  paddingBottom: 8,
};

const title = StyleSheet.create({
  text: {
    flex: 1,
    color: yellow,
    fontSize: 18,
    fontFamily: adventPro('Bold'),
  },
  container: {
    width: '100%',
    paddingBottom: 8,
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
  color: white,
};

const dateSeparator = {
  padding: 60,
  flex: 1,
  justifyContent: 'center',
};

const dateSeparatorText = {
  fontFamily: adventPro('Bold'),
  color: yellow,
  fontSize: 30,
  flex: 1,
  textAlign: 'center',
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

const eventContainer = {
  flex: 1,
  paddingBottom: 20,
};

const timelineIllustration = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ball: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: lightBlue,
  },
  line: {
    backgroundColor: lightBlue,
    flex: 1,
    width: 1,
  },
});

const time = StyleSheet.create({
  container: {
    width: 50,
    alignItems: 'flex-end',
  },
  text: {
    fontFamily: adventPro('Bold'),
    color: white,
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
    fontFamily: nunito(),
    fontSize: 14,
    textAlign: 'center',
    color: lightBlue,
  },
});

const location = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
  text: {
    paddingLeft: 5,
    color: yellow,
    fontSize: 14,
    textTransform: 'uppercase',
  },
});

const dayMenu = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    height: 50,
    paddingLeft: 8,
    paddingRight: 8,
  },
  text: {
    fontFamily: adventPro('SemiBold'),
    fontSize: 22,
    color: white,
    textAlign: 'center',
  },
  textHighlight: {
    fontFamily: adventPro('SemiBold'),
    fontSize: 22,
    color: yellow,
    textAlign: 'center',
  },
  textDisabled: {
    fontFamily: adventPro('SemiBold'),
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
    backgroundColor: '#0D273C',
    padding: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  scrollView: {
    flex: 1,
    backgroundColor: darkBlue,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

const filters = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    paddingRight: 10,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    color: white,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: white,
    fontSize: 16,
    fontFamily: nunito(),
    height: 30,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 11,
    color: white,
    paddingLeft: 15,
    paddingRight: 15,
    fontFamily: nunito(),
  },
});

export default {
  ...StyleSheet.create({
    body,
    author,
    authorTitle,
    dateSeparator,
    dateSeparatorText,
    scheduleInfo,
    fixedEventTitle,
    scheduleContainer,
    dayContainer,
    eventContainer,
  }),
  title,
  emptyMessage,
  categories,
  timelineIllustration,
  time,
  location,
  dayMenu,
  schedulePage,
  footer,
  filters,
};
