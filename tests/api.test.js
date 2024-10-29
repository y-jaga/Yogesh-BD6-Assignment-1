const request = require('supertest');
const http = require('http');
const { getAllShows, getShowById, addShow } = require('../helper');
const { app } = require('../index');

jest.mock('../helper', () => ({
  ...jest.requireActual('../helper'),
  getAllShows: jest.fn(),
  getShowById: jest.fn(),
  addShow: jest.fn(),
}));

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe('API Endpoint Testing', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //Test 1: Get All Shows
  it('GET API /shows endpoint retrieves all shows.', async () => {
    let mockedShows = [
      { showId: 1, title: 'The Lion King', theatreId: 1, time: '7:00 PM' },
      { showId: 2, title: 'Hamilton', theatreId: 2, time: '8:00 PM' },
      { showId: 3, title: 'Wicked', theatreId: 3, time: '9:00 PM' },
      { showId: 4, title: 'Les Misérables', theatreId: 1, time: '6:00 PM' },
    ];

    getAllShows.mockReturnValue(mockedShows);

    const res = await request(server).get('/shows');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ shows: mockedShows });
  });

  //Test 2: Get Show by ID
  it('GET API /shows/:id endpoint retrieves a specific show by ID.', async () => {
    let mockedMovie = {
      showId: 1,
      title: 'The Lion King',
      theatreId: 1,
      time: '7:00 PM',
    };

    getShowById.mockReturnValue(mockedMovie);

    const res = await request(server).get('/shows/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ show: mockedMovie });
  });

  //Test 3: Add a New Show
  it('POST API /shows endpoint successfully adds a new show with valid input.', async () => {
    let mockedMovie = {
      showId: 5,
      title: 'Phantom of the Opera',
      theatreId: 2,
      time: '5:00 PM',
    };

    addShow.mockResolvedValue(mockedMovie);

    let res = await request(server).post('/shows').send({
      title: 'Phantom of the Opera',
      theatreId: 2,
      time: '5:00 PM',
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockedMovie);
  });

  //Test 4: Error Handling for Get Show by Invalid ID
  it('GET API /shows/:id endpoint returns a 404 code when provided with an invalid ID.', async () => {
    getShowById.mockReturnValue(null);

    let res = await request(server).get('/shows/11');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'No show found.' });
  });

  //Test 5: Input Validation for Add Show
  it('POST API /shows endpoint returns a 400 status code when provided with invalid input.', async () => {
    const res = await request(server).post('/shows').send({
      theatreId: 2,
      time: '5:00 PM',
    });
    expect(res.status).toBe(400);
    expect(res.text).toEqual('title is required and should be string');
  });
});

describe('Helper Functions Testing', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //Test 6: Mock getAllShows Function
  it('should return all shows', () => {
    let result = getAllShows();
    expect(result).toEqual([
      { showId: 1, title: 'The Lion King', theatreId: 1, time: '7:00 PM' },
      { showId: 2, title: 'Hamilton', theatreId: 2, time: '8:00 PM' },
      { showId: 3, title: 'Wicked', theatreId: 3, time: '9:00 PM' },
      { showId: 4, title: 'Les Misérables', theatreId: 1, time: '6:00 PM' },
    ]);
  });

  //Test 7: Mock Add Show Function (Async)
  it('should add new show', async () => {
    let mockAddedShow = {
      showId: 5,
      title: 'Phantom of the Opera',
      theatreId: 2,
      time: '5:00 PM',
    };

    let result = await addShow({
      title: 'Phantom of the Opera',
      theatreId: 2,
      time: '5:00 PM',
    });

    expect(result).toEqual(mockAddedShow);
  });
});
