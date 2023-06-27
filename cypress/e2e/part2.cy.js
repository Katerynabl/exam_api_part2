import * as faker from 'faker';

describe('User Registration', () => {
  let user;
  let accessToken;
  before(() => {
    user = {
      email: faker.internet.email(),
      password: faker.internet.password()
    };
  });

  it('Register a new user', () => {
    cy.request('POST', '/register', user).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('accessToken');
      accessToken = response.body.accessToken;
      const data = JSON.stringify({ accessToken, user });

      cy.writeFile('RegisteredUsers.json', data);
      cy.log(user);
    });
});


  it('Get all posts', () => {
    cy.log(`all posts`);
  
    cy.request('GET', `/posts`).then(response => {
      expect(response.status).to.be.equal(200);
      cy.log(response.body);
    });
  });


   it('Get firtst 10 posts', () => {
      cy.request('GET', `/posts?limit=10`).then(response => {
      expect(response.status).to.be.equal(200);
      cy.log(response.body);
    });
  });


   it('Get post # 50 and 60 ', () => {
      cy.request('GET', `/posts?id=50&id=60`).then(response => {
      expect(response.status).to.be.equal(200);
      cy.log(response.body);
    });
  });


  it('Create a new post with code 401', () => {
    let post = {
      id: faker.random.number(),
      title: faker.company.name,
      author: faker.name.findName()
    };
    cy.request({
      method: 'POST',
      url: '/664/posts',
      body: post,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(401);
      cy.log(response.status);
    });
  });


it('Create a new post with access token in header', () => {
  cy.readFile('RegisteredUsers.json').then((fileContents) => {
    const registeredUser = fileContents;
    accessToken = registeredUser.accessToken;

    let post = {
      id: faker.random.number(),
      title: faker.company.name,
      author: faker.name.findName()
    };

    cy.request({
      method: 'POST',
      url: '/664/posts',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: post
    }).then((response) => {
      expect(response.status).to.equal(201);
      cy.log(response.status,{accessToken}); 
    });
});
});


it('Create a new post entity', () => {
  cy.readFile('RegisteredUsers.json').then((fileContents) => {
    const registeredUser = fileContents;
    accessToken = registeredUser.accessToken;
    cy.request('GET', '/posts').then((response) => {
    expect(response.status).to.equal(200);

      const posts = response.body;

      posts.forEach((post) => {
        post.postDate = ''; 
        cy.request({
          method: 'PUT',
          url: `/posts/${post.id}`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: post
        }).then((response) => {
          expect(response.body).to.have.property('postDate');
          expect(response.status).to.equal(200);
          cy.log(response.body); 

});
});
});
});
});



it('Update all mistakes in posts if mistake entity exists', () => {
  cy.request('GET', '/posts').then((response) => {
    const posts = response.body;

    cy.wrap(posts).each((post) => {
      if (post.hasOwnProperty('mistake')) {
        post.mistake = 'Mistake exists';

        cy.request({
          method: 'PUT',
          url: `/posts/${post.id}`,
          body: post,
          failOnStatusCode: false
        }).then((response) => {
          if (response.status === 200) {
            expect(response.status).to.equal(200);
          } else {
            expect(response.status).to.equal(404);
            cy.log(response.status);
          }
        });
      }
    });
  });
});


it('Create a new post entity and update it', () => {
  cy.readFile('RegisteredUsers.json').then((fileContents) => {
    const registeredUser = fileContents;
    accessToken = registeredUser.accessToken;

    cy.request('GET', '/posts').then((response) => {
      expect(response.status).to.equal(200);

      const posts = response.body;

      posts.forEach((post) => {
          nameforbook: faker.lorem.words()
        

        cy.request({
          method: 'PUT',
          url: `/posts/${post.id}`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: post
        }).then((response) => {
          expect(response.body.nameforbook).to.equal(post.nameforbook);
          expect(response.status).to.equal(200);
          cy.log(response.body); 
        });
      });
    });
  });
});



it('Delete not existing entity', () => {
  cy.readFile('RegisteredUsers.json').then((fileContents) => {
    const registeredUser = fileContents;
    const accessToken = registeredUser.accessToken;

    cy.request('GET', '/posts').then((response) => {
      expect(response.status).to.equal(200);
      const posts = response.body;

      cy.request({
        method: 'DELETE',
        url: '/posts',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: { missingEntity: 'Non-existent entity' },
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 200) {
          expect(response.status).to.equal(200);
        } else {

          expect(response.status).to.equal(404);
          cy.log(response.status); 
        }
      });
    });
  });
});



it('Create a new post entity and update it, and then delete', () => {
  cy.readFile('RegisteredUsers.json').then((fileContents) => {
    const registeredUser = fileContents;
    const accessToken = registeredUser.accessToken;

    cy.request('GET', '/posts').then((response) => {
      expect(response.status).to.equal(200);

      const posts = response.body;

      posts.forEach((post) => {
        const ForDeletindEntity = faker.lorem.words(); 

        post.ForDeletindEntity = ForDeletindEntity;

        cy.request({
          method: 'PUT',
          url: `/posts/${post.id}`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: post
        }).then((response) => {
          expect(response.body.ForDeletindEntity).to.equal(post.ForDeletindEntity);
          expect(response.status).to.equal(200);
          cy.log('Entity is created and updated:', response.body);

  
          delete post.ForDeletindEntity;

          cy.request({
            method: 'PUT',
            url: `/posts/${post.id}`,
            headers: {
              Authorization: `Bearer ${accessToken}`
            },
            body: post
          }).then((response) => {
            expect(response.status).to.equal(200);
            cy.log('ForDeletindEntity is deleted from the post:', ForDeletindEntity);


            cy.request({
              method: 'GET',
              url: `/posts/${post.id}`,
              failOnStatusCode: false
            }).then((response) => {
              expect(response.body.ForDeletindEntity).to.be.undefined;
              cy.log('ForDeletindEntity property not found in the post:', response.status);
            });
          });
        });
      });
    });
  });
});
});



