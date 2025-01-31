import t from 'tap'

import {parse} from '../src/parser'
import {typeEvaluate} from '../src/typeEvaluator/typeEvaluate'
import {createReferenceTypeNode, nullUnion, unionOf} from '../src/typeEvaluator/typeHelpers'
import type {
  ArrayTypeNode,
  Document,
  ObjectAttribute,
  ObjectTypeNode,
  Schema,
  TypeDeclaration,
  TypeNode,
  UnionTypeNode,
} from '../src/typeEvaluator/types'

const postDocument = {
  type: 'document',
  name: 'post',
  attributes: {
    _id: {
      type: 'objectAttribute',
      value: {
        type: 'string',
      },
    } satisfies ObjectAttribute,
    _type: {
      type: 'objectAttribute',
      value: {
        type: 'string',
        value: 'post',
      },
    } satisfies ObjectAttribute,
    name: {
      type: 'objectAttribute',
      value: {
        type: 'string',
      },
    } satisfies ObjectAttribute,
    lastname: {
      type: 'objectAttribute',
      value: {
        type: 'string',
      },
      optional: true,
    } satisfies ObjectAttribute,
    publishedAt: {
      type: 'objectAttribute',
      value: {
        type: 'string',
      },
      optional: true,
    } satisfies ObjectAttribute,
    author: {
      type: 'objectAttribute',
      value: createReferenceTypeNode('author'),
    } satisfies ObjectAttribute,
    sluger: {
      type: 'objectAttribute',
      value: {
        type: 'inline',
        name: 'slug',
      },
      optional: true,
    } satisfies ObjectAttribute,
    authorOrGhost: {
      type: 'objectAttribute',
      value: {
        type: 'union',
        of: [createReferenceTypeNode('author'), createReferenceTypeNode('ghost')],
      },
      optional: true,
    } satisfies ObjectAttribute,
    allAuthorOrGhost: {
      type: 'objectAttribute',
      value: {
        type: 'array',
        of: {
          type: 'union',
          of: [createReferenceTypeNode('author', true), createReferenceTypeNode('ghost', true)],
        },
      },
      optional: true,
    } satisfies ObjectAttribute,
  },
} satisfies Document

const authorDocument = {
  type: 'document',
  name: 'author',
  attributes: {
    _id: {
      type: 'objectAttribute',
      value: {
        type: 'string',
      },
    },
    _type: {
      type: 'objectAttribute',
      value: {
        type: 'string',
        value: 'author',
      },
    },
    name: {
      type: 'objectAttribute',
      value: {
        type: 'string',
      },
    },
    firstname: {
      type: 'objectAttribute',
      value: {
        type: 'string',
      },
    },
    lastname: {
      type: 'objectAttribute',
      value: {
        type: 'string',
      },
    },
    _createdAt: {
      type: 'objectAttribute',
      value: {
        type: 'string',
      },
    },
    age: {
      type: 'objectAttribute',
      value: {
        type: 'number',
      },
    },
    ages: {
      type: 'objectAttribute',
      value: {
        type: 'array',
        of: {
          type: 'number',
        },
      },
      optional: true,
    },
    optionalAge: {
      type: 'objectAttribute',
      value: {
        type: 'number',
      },
      optional: true,
    },
    object: {
      type: 'objectAttribute',
      value: {
        type: 'object',
        attributes: {
          subfield: {
            type: 'objectAttribute',
            value: {
              type: 'string',
            },
          },
        },
      },
    },
    optionalObject: {
      type: 'objectAttribute',
      optional: true,
      value: {
        type: 'object',
        attributes: {
          subfield: {
            type: 'objectAttribute',
            value: {
              type: 'string',
            },
          },
        },
      },
    },
  },
} satisfies Document
const ghostDocument = {
  type: 'document',
  name: 'ghost',
  attributes: {
    _id: {
      type: 'objectAttribute',
      value: {
        type: 'string',
      },
    },
    _type: {
      type: 'objectAttribute',
      value: {
        type: 'string',
        value: 'ghost',
      },
    },
    name: {
      type: 'objectAttribute',
      value: {
        type: 'string',
      },
    },
    concepts: {
      type: 'objectAttribute',
      value: {
        type: 'array',
        of: {
          type: 'object',
          attributes: {
            _key: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
          },
          rest: {
            type: 'inline',
            name: 'concept',
          },
        },
      },
    },
  },
} satisfies Document

const namespaceOneDocument = {
  type: 'document',
  name: 'namespace.one',
  attributes: {
    _type: {
      type: 'objectAttribute',
      value: {
        type: 'string',
        value: 'namespace.one',
      },
    } satisfies ObjectAttribute,
    name: {
      type: 'objectAttribute',
      value: {
        type: 'string',
      },
    } satisfies ObjectAttribute,
    boolField: {
      type: 'objectAttribute',
      value: {
        type: 'boolean',
      },
      optional: true,
    } satisfies ObjectAttribute,
  },
} satisfies Document

const namespaceTwoDocument = {
  type: 'document',
  name: 'namespace.two',
  attributes: {
    _type: {
      type: 'objectAttribute',
      value: {
        type: 'string',
        value: 'namespace.two',
      },
    } satisfies ObjectAttribute,
    name: {
      type: 'objectAttribute',
      value: {
        type: 'string',
      },
    } satisfies ObjectAttribute,
  },
} satisfies Document
const conceptType = {
  type: 'type',
  name: 'concept',
  value: {
    type: 'object',
    attributes: {
      name: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      enabled: {
        type: 'objectAttribute',
        value: {
          type: 'boolean',
        },
      },
      posts: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: createReferenceTypeNode('post', true),
        },
      },
    },
  },
} satisfies TypeDeclaration
const slugType = {
  name: 'slug',
  type: 'type',
  value: {
    type: 'object',
    attributes: {
      current: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      source: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'slug',
        },
      },
      _key: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
    },
  },
} satisfies TypeDeclaration

const schemas = [
  postDocument,
  authorDocument,
  ghostDocument,
  namespaceOneDocument,
  namespaceTwoDocument,
  conceptType,
  slugType,
] satisfies Schema

t.test('no projection', (t) => {
  const query = `*[_type == "author" && _id == "123"]`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: findSchemaType('author'),
  } satisfies TypeNode)
  t.end()
})
t.test('pipe func call', (t) => {
  const query = `*[_type == "author" && defined(slug.current)] | order(_createdAt desc)`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: findSchemaType('author'),
  } satisfies TypeNode)
  t.end()
})

t.test('element access', (t) => {
  const query = `*[_type == "author"][0]`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'union',
    of: [findSchemaType('author'), {type: 'null'}],
  } satisfies TypeNode)
  t.end()
})

t.test('element access with attribute access', (t) => {
  const query = `*[_type == "post"][0].allAuthorOrGhost[] { _ref}`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'union',
    of: [
      {
        type: 'array',
        of: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
          },
        },
      },
      {type: 'null'},
    ],
  } satisfies TypeNode)
  t.end()
})

t.test('access attribute with objects', (t) => {
  const query = `*[_type == "author" && object.subfield == "foo"][0]`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'union',
    of: [findSchemaType('author'), {type: 'null'}],
  } satisfies TypeNode)
  t.end()
})

t.test('access attribute with derefences', (t) => {
  const query = `*[authorOrGhost->name == "foo"][0]`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'union',
    of: [findSchemaType('post'), {type: 'null'}],
  } satisfies TypeNode)
  t.end()
})

t.test('parameters', (t) => {
  const query = `*[_type == "author" && _id == $id]`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    of: findSchemaType('author'),
    type: 'array',
  } satisfies ArrayTypeNode)

  t.end()
})

t.test('filtering on sub-child', (t) => {
  const query = `*[_type == "author" && object.subfield == $slug]`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    of: findSchemaType('author'),
    type: 'array',
  } satisfies ArrayTypeNode)

  t.end()
})

t.test('in operator', (t) => {
  const query = `*[_type in ["author", "post"]]`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'union',
      of: [findSchemaType('author'), findSchemaType('post')],
    },
  } satisfies ArrayTypeNode<UnionTypeNode>)

  t.end()
})

t.test('attribute access on inline types', (t) => {
  const query = `*[_type == "ghost"] {
    "conceptNames": concepts[].name
  }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        conceptNames: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'string',
            },
          },
        },
      },
    },
  } satisfies ArrayTypeNode)

  t.end()
})

t.test('match operator', (t) => {
  const query = `*[_type match "namespace.**"  &&  !(_id in path("drafts.**"))]`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'union',
      of: [findSchemaType('namespace.one'), findSchemaType('namespace.two')],
    },
  } satisfies ArrayTypeNode<UnionTypeNode>)

  t.end()
})

t.test('subfilter matches', (t) => {
  const query = `*[_type match "namespace.**"][boolField == true]`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: findSchemaType('namespace.one'),
  } satisfies ArrayTypeNode)

  t.end()
})

t.test('subfilter doesnt match', (t) => {
  const query = `*[_type == "namespace.two"][boolField == true]`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'union',
      of: [],
    },
  } satisfies TypeNode)

  t.end()
})

t.test('subfilter with projection', (t) => {
  const query = `*[_type == "namespace.one"] {name, _type} [_type == "namespace.one"]`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        name: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
        },
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'namespace.one',
          },
        },
      },
    },
  } satisfies ArrayTypeNode<ObjectTypeNode>)

  t.end()
})

t.test('filter on null union', (t) => {
  const query = `*[_type == "ghost"][0].concepts[_key == "hello"].name`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(
    res,
    nullUnion({
      type: 'array',
      of: {
        type: 'string',
      },
    }) satisfies TypeNode,
  )

  t.end()
})

t.test('attribute access', (t) => {
  const query = `*[_type == "author"][].object.subfield`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'string',
    },
  } satisfies TypeNode)

  t.end()
})

t.test('coerce reference', (t) => {
  const query = `*[_type == "post" && defined(author.name)][].author`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: createReferenceTypeNode('author'),
  } satisfies TypeNode)

  t.end()
})

t.test('object references', (t) => {
  const query = `*[_type == "ghost"]{
      ...,
      "enabledConcepts": concepts[enabled == true] {
        name,
      },
      "disabledConcepts": concepts[enabled == false],
    }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.matchSnapshot(res)
  t.end()
})

t.test('never', (t) => {
  const query = `*[1 == 1 && 1 == 2]{
        name,
      }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'union',
      of: [],
    },
  } satisfies ArrayTypeNode)

  t.end()
})

t.test('simple', (t) => {
  const query = `*[_type == "post"]{
            name,
          }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)

  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        name: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
        },
      },
    },
  } satisfies TypeNode)

  t.end()
})

t.test('values in projection', (t) => {
  const query = `*[_type == "author"]{
            "isAuthor": _type == "author",
            "greaterThan": 5 > 3,
            "lessThan": 5 < 3,
            "greaterThanOrEq": 10 >= 3,
            "lessThanOrEq": 5 <= 5,
            "notEqual": 3 != "foo",
            "notEqualObject": 3 != {},
            "plus": 3 + 2,
            "plusStr": "3" + "2",
            "plusVar": 3 + age,
            "minus": 3 - 2,
            "mul": 3 * 3,
            "div": 100 / 5,
            "exp": 3 ** 3,
            "mod": 3 % 2,
            "arr": [1, 2, 3] + [4, 5, 6],
            "and": 3 > foo && 3 > bar,
            "or": 3 > foo || 3 > bar,
          }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        isAuthor: {
          type: 'objectAttribute',
          value: {
            type: 'boolean',
            value: true,
          },
        },
        greaterThan: {
          type: 'objectAttribute',
          value: {
            type: 'boolean',
            value: true,
          },
        },
        lessThan: {
          type: 'objectAttribute',
          value: {
            type: 'boolean',
            value: false,
          },
        },
        greaterThanOrEq: {
          type: 'objectAttribute',
          value: {
            type: 'boolean',
            value: true,
          },
        },
        lessThanOrEq: {
          type: 'objectAttribute',
          value: {
            type: 'boolean',
            value: true,
          },
        },
        notEqual: {
          type: 'objectAttribute',
          value: {
            type: 'boolean',
            value: true,
          },
        },
        notEqualObject: {
          type: 'objectAttribute',
          value: {
            type: 'boolean',
            value: true,
          },
        },
        plus: {
          type: 'objectAttribute',
          value: {
            type: 'number',
            value: 5,
          },
        },
        plusStr: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: '32',
          },
        },
        plusVar: {
          type: 'objectAttribute',
          value: {
            type: 'number',
            value: undefined,
          },
        },
        minus: {
          type: 'objectAttribute',
          value: {
            type: 'number',
            value: 1,
          },
        },
        mul: {
          type: 'objectAttribute',
          value: {
            type: 'number',
            value: 9,
          },
        },
        div: {
          type: 'objectAttribute',
          value: {
            type: 'number',
            value: 20,
          },
        },
        exp: {
          type: 'objectAttribute',
          value: {
            type: 'number',
            value: 27,
          },
        },
        mod: {
          type: 'objectAttribute',
          value: {
            type: 'number',
            value: 1,
          },
        },
        arr: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'union',
              of: [
                {
                  type: 'number',
                  value: 1,
                },
                {
                  type: 'number',
                  value: 2,
                },
                {
                  type: 'number',
                  value: 3,
                },
                {
                  type: 'number',
                  value: 4,
                },
                {
                  type: 'number',
                  value: 5,
                },
                {
                  type: 'number',
                  value: 6,
                },
              ],
            },
          },
        },
        and: {
          type: 'objectAttribute',
          value: {
            type: 'boolean',
            value: undefined,
          },
        },
        or: {
          type: 'objectAttribute',
          value: {
            type: 'boolean',
            value: undefined,
          },
        },
      },
    },
  } satisfies ArrayTypeNode<ObjectTypeNode>)

  t.end()
})

t.test('deref', (t) => {
  const query = `*[_type == "post"]{
            name,
            author->
          }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        name: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
        },
        author: {
          type: 'objectAttribute',
          value: findSchemaType('author'),
        },
      },
    },
  } satisfies TypeNode)

  t.end()
})

t.test('deref with projection union', (t) => {
  const query = `*[_type == "post"]{
            ...,
            name,
            authorOrGhost->,
            "authorName": author->name,
            "authorOrGhostName": authorOrGhost->name,
            "authorOrGhostProjected": authorOrGhost->{name, _type},
            "resolvedAllAuthorOrGhost": allAuthorOrGhost->,
          }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        _id: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
        },
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'post',
          },
        },
        name: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
        },
        lastname: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        publishedAt: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        author: {
          type: 'objectAttribute',
          value: createReferenceTypeNode('author'),
        },
        sluger: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'slug',
          },
          optional: true,
        },
        authorOrGhost: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [findSchemaType('author'), findSchemaType('ghost'), {type: 'null'}],
          },
        },
        allAuthorOrGhost: {
          type: 'objectAttribute',
          optional: true,
          value: {
            type: 'array',
            of: {
              type: 'union',
              of: [createReferenceTypeNode('author', true), createReferenceTypeNode('ghost', true)],
            },
          },
        },
        authorName: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
        },
        authorOrGhostName: {
          type: 'objectAttribute',
          value: nullUnion({
            type: 'string',
          }),
        },
        authorOrGhostProjected: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'object',
                attributes: {
                  name: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                  _type: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                      value: 'author',
                    },
                  },
                },
              },
              {
                type: 'object',
                attributes: {
                  name: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                  _type: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                      value: 'ghost',
                    },
                  },
                },
              },
              {type: 'null'},
            ],
          },
        },
        resolvedAllAuthorOrGhost: {
          type: 'objectAttribute',
          value: nullUnion({
            type: 'array',
            of: {
              type: 'union',
              of: [findSchemaType('author'), findSchemaType('ghost')],
            },
          }),
        },
      },
    },
  } satisfies TypeNode)

  t.end()
})

t.test('deref with projection', (t) => {
  const query = `*[_type == "post"]{
            name,
            author->{_id, name}
          }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        name: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
        },
        author: {
          type: 'objectAttribute',
          value: {
            type: 'object',
            attributes: {
              _id: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
              },
              name: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  } satisfies TypeNode)

  t.end()
})

t.test('deref with projection and element access', (t) => {
  const query = `*[_type == "post" && name == "foo" && _id == "123"]{
            name,
            author->{_id, name}
          }[0]`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'union',
    of: [
      {
        type: 'object',
        attributes: {
          name: {
            type: 'objectAttribute',
            value: {
              type: 'string',
            },
          },
          author: {
            type: 'objectAttribute',
            value: {
              type: 'object',
              attributes: {
                _id: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
                name: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
      {type: 'null'},
    ],
  } satisfies TypeNode)

  t.end()
})

t.test('deref with element access, then projection ', (t) => {
  const query = `*[_type == "post" && name == "foo" && _id == "123"][0]{
            name,
            author->{_id, name}
          }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'union',
    of: [
      {
        type: 'object',
        attributes: {
          name: {
            type: 'objectAttribute',
            value: {
              type: 'string',
            },
          },
          author: {
            type: 'objectAttribute',
            value: {
              type: 'object',
              attributes: {
                _id: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
                name: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
      {type: 'null'},
    ],
  } satisfies TypeNode)

  t.end()
})

t.test('subquery', (t) => {
  const query = `*[_type == "author"]{
            "posts": *[_type == "post" && references(^._id) && ^._id == "123"] {
              "publishedAfterAuthor": publishedAt > ^._createdAt,
            }
          }`

  const ast = parse(query)
  const res = typeEvaluate(ast, [authorDocument, postDocument])
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        posts: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                publishedAfterAuthor: {
                  type: 'objectAttribute',
                  value: nullUnion({
                    type: 'boolean',
                    value: undefined,
                  }),
                },
              },
            },
          },
        },
      },
    } satisfies TypeNode,
  } satisfies TypeNode)

  t.end()
})

t.test('string concetnation', (t) => {
  const query = `*[_type == "author"]{
            name,
            "fullName": firstname + " " + lastname,
          }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)

  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        name: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
        },
        fullName: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: undefined,
          },
        },
      },
    },
  } satisfies ArrayTypeNode<ObjectTypeNode>)

  t.end()
})
t.test('with select', (t) => {
  const query = `*[_type == "author" || _type == "post"] {
        _type,
        "authorName": select(
          _type == "author" => name,
          _type == "post" => lastname,
          "unknown name"
        )
      }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'union',
      of: [
        {
          type: 'object',
          attributes: {
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'author',
              },
            },
            authorName: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
          },
        },
        {
          type: 'object',
          attributes: {
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'post',
              },
            },
            authorName: {
              type: 'objectAttribute',
              value: nullUnion({
                type: 'string',
              }),
            },
          },
        },
      ],
    },
  } satisfies TypeNode)

  t.end()
})

t.test('with select, not guaranteed & with fallback', (t) => {
  const query = `*[_type == "author" || _type == "post"] {
        _type,
        "something": select(
          _id > 5 => _id,
          "old id"
        )
      }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'union',
      of: [
        {
          type: 'object',
          attributes: {
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'author',
              },
            },
            something: {
              type: 'objectAttribute',
              value: {
                type: 'union',
                of: [
                  {
                    type: 'string',
                  },
                  {
                    type: 'string',
                    value: 'old id',
                  },
                ],
              },
            },
          },
        },
        {
          type: 'object',
          attributes: {
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'post',
              },
            },
            something: {
              type: 'objectAttribute',
              value: {
                type: 'union',
                of: [
                  {
                    type: 'string',
                  },
                  {
                    type: 'string',
                    value: 'old id',
                  },
                ],
              },
            },
          },
        },
      ],
    },
  } satisfies TypeNode)

  t.end()
})

t.test('with splat', (t) => {
  const query = `*[_type == "author"] {
        ...,
        "otherName": name
      }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)

  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        _id: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
        },
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'author',
          },
        },
        name: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
        },
        firstname: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
        },
        lastname: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
        },
        _createdAt: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
        },
        age: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
        },
        ages: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'number',
            },
          },
          optional: true,
        },
        optionalAge: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
        object: {
          type: 'objectAttribute',
          value: {
            type: 'object',
            attributes: {
              subfield: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
              },
            },
          },
        },
        optionalObject: {
          type: 'objectAttribute',
          optional: true,
          value: {
            type: 'object',
            attributes: {
              subfield: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
              },
            },
          },
        },
        otherName: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
        },
      },
    },
  } satisfies TypeNode)

  t.end()
})

t.test('with conditional splat', (t) => {
  const query = `{"foo": 1}{
    "not" == 1 => {
      "nomatch": 0,
    },
    "match" == "match" => {
      "match": 1,
    },
    "maybe" == $foo => {
      "maybe": 2,
      foo
    }
  }`

  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'object',
    attributes: {
      foo: {
        type: 'objectAttribute',
        value: {
          type: 'number',
          value: 1,
        },
        optional: true,
      },
      match: {
        type: 'objectAttribute',
        value: {
          type: 'number',
          value: 1,
        },
      },
      maybe: {
        type: 'objectAttribute',
        value: {
          type: 'number',
          value: 2,
        },
        optional: true,
      },
    },
  } satisfies TypeNode)

  t.end()
})

t.test('coalesce only', async (t) => {
  const query = `*[_type == "author"]{
          "name": coalesce(name, "unknown"),
          "maybe": coalesce(optionalObject, dontExists)
        }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.matchSnapshot(res)
  t.end()
})

t.test('coalesce with projection', async (t) => {
  const query = `*[_type == "author"][0]{
          _type,
          "foo": coalesce(optionalObject, dontExists) {
            subfield,
            ref->
          },
        }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.matchSnapshot(res)
  t.end()
})

t.test('number', (t) => {
  const query = `3`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'number',
    value: 3,
  })
  t.end()
})
t.test('string', (t) => {
  const query = `"hello"`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'string',
    value: 'hello',
  })
  t.end()
})
t.test('null', (t) => {
  const query = `null`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'null',
  })
  t.end()
})
t.test('object', (t) => {
  const query = `{ "hello": "world" }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'object',
    attributes: {
      hello: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'world',
        },
      },
    },
  } satisfies TypeNode)

  t.end()
})

t.test('filter with function', (t) => {
  const query = `*[_type == "author" && defined(slug.current)]`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: findSchemaType('author'),
  } satisfies TypeNode)

  t.end()
})

t.test('filter with type reference', (t) => {
  const ast = parse(`*[_type == "post" && sluger.current == $foo][0]`)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'union',
    of: [findSchemaType('post'), {type: 'null'}],
  } satisfies TypeNode)
  t.end()
})

t.test('filter order doesnt matter', (t) => {
  const res = typeEvaluate(parse(`*[_type == "author" && _id == "123"]`), schemas)
  t.strictSame(res, typeEvaluate(parse(`*["author" == _type &&  "123" == _id]`), schemas))
  t.matchSnapshot(res)

  t.end()
})

t.test('misc', (t) => {
  const query = `*[]{
      "group": ((3 + 4) * 5),
      "notBool": !false,
      "notField": !someAttriute,
      "unknownParent": ^._id,
      "unknownParent2": ^.^.^.^.^.^.^.^._id,
      "andWithAttriute": !false && !someAttriute,
      "pt": pt::text(block)
    }`
  const ast = parse(query)
  const res = typeEvaluate(ast, [{type: 'document', name: 'foo', attributes: {}}])
  t.matchSnapshot(res)

  t.end()
})

t.test('flatmap', (t) => {
  const query = `*[_type == "post"].allAuthorOrGhost[]`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.matchSnapshot(res)

  t.end()
})

t.test('can resolve attributes on inline rest', (t) => {
  const query = `*[_type == "ghost"] {
      concepts[] {
        _key,
        name
      }
  }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)

  // Check that the result is an array of objects with array of objects with _key and name
  t.ok(
    res.type === 'array' &&
      res.of.type === 'object' &&
      res.of.attributes['concepts'].value.type === 'array' &&
      res.of.attributes['concepts'].value.of.type === 'object' &&
      '_key' in res.of.attributes['concepts'].value.of.attributes &&
      'name' in res.of.attributes['concepts'].value.of.attributes,
  )
  t.matchSnapshot(res)

  t.end()
})

// Fetch posts with detailed author, ghost, and concept information
t.test('complex', (t) => {
  const query = `*[_type == "post"]{
    _id,
    _type,
    name,
    lastname,
    "authorDetails": author->{
      _id,
      _type,
      name,
      firstname,
      lastname,
      object,
      optionalObject
    },
    "slugerDetails": sluger->{
      _type,
      current,
      source,
      _key
    },
    "authorOrGhost": authorOrGhost->{
      _type,
      name,
      "details": select(
        _type == "author" => {
          firstname,
          lastname,
          object,
          optionalObject
        },
        _type == "ghost" => {
          concepts[] {
            name,
            enabled,
            posts[]->{_id, name}
          }
        }
      )
    },
    "allAuthorsOrGhosts": allAuthorOrGhost[]->{
      _type,
      name,
      "details": select(
        _type == "author" => {
          firstname,
          lastname,
          object,
          optionalObject
        },
        _type == "ghost" => {
          concepts[] {
            name,
            enabled,
            posts[]->{_id, name}
          }
        }
      )
    }
  }`

  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.matchSnapshot(res)

  t.end()
})

// Fetch posts with complex filtering on optional fields and references
t.test('complex 2', (t) => {
  const query = `*[_type == "post" && defined(sluger) && (author->firstname match "Emily*" || authorOrGhost->name match "Ghost*")]{
    _id,
    name,
    "authorFullName": author->firstname + " " + author->lastname,
    "slug": sluger->current,
    "relatedConcepts": authorOrGhost->concepts[] {
      name,
      "isActive": enabled,
      "relatedPostsCount": count(posts)
    },
    "collaborators": allAuthorOrGhost[]->{
      _type,
      name,
      "collaboratorPosts": *[_type == "post" && references(^._id)].name
    }
  }`

  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.matchSnapshot(res)

  t.end()
})

t.test('InRange', (t) => {
  const query = `*[_type == "post"][0..5]`

  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.same(res.type, 'array')
  t.matchSnapshot(res)

  t.end()
})

t.test('union conditions over references', (t) => {
  const query = `*[_type == 'post'] {
    name,
    allAuthorOrGhost[]-> {
      _type == 'author' => {
        'type': _type,
        'age': age
      },

      _type == 'ghost' => {
        'type': _type,
        title,
      }
    }
  }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        name: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
        },
        allAuthorOrGhost: {
          type: 'objectAttribute',
          value: nullUnion({
            type: 'array',
            of: {
              type: 'union',
              of: [
                {
                  type: 'object',
                  attributes: {
                    type: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                        value: 'author',
                      },
                    },
                    age: {
                      type: 'objectAttribute',
                      value: {
                        type: 'number',
                      },
                    },
                  },
                },
                {
                  type: 'object',
                  attributes: {
                    type: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                        value: 'ghost',
                      },
                    },
                    title: {
                      type: 'objectAttribute',
                      value: {
                        type: 'null',
                      },
                    },
                  },
                },
              ],
            },
          }),
        },
      },
    },
  })

  t.end()
})

t.test('this operator', (t) => {
  const ast = parse(`*{"biggerThanTen": numbers[@ > 10], "this": @}`)
  const schema = {
    type: 'document',
    name: 'foo',
    attributes: {
      numbers: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'number',
          },
        },
      },
    },
  } satisfies Document
  const res = typeEvaluate(ast, [schema])
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        biggerThanTen: schema.attributes.numbers,
        this: {
          type: 'objectAttribute',
          value: {
            type: 'object',
            attributes: schema.attributes,
          },
        },
      },
    },
  })
  t.end()
})

t.test('neg node', (t) => {
  const query = `*[_type == "author"] {
    "minusAge": -age,
    "notNumber": -name,
    "constant": -(3 + 4),
  }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        minusAge: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
        },
        notNumber: {
          type: 'objectAttribute',
          value: {
            type: 'null',
          },
        },
        constant: {
          type: 'objectAttribute',
          value: {
            type: 'number',
            value: -7,
          },
        },
      },
    },
  })
  t.end()
})

t.test('pos node', (t) => {
  const query = `*[_type == "author"] {
    "age": +age,
    "notNumber": +name,
    "constant": +(3 + 4),
  }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        age: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
        },
        notNumber: {
          type: 'objectAttribute',
          value: {
            type: 'null',
          },
        },
        constant: {
          type: 'objectAttribute',
          value: {
            type: 'number',
            value: 7,
          },
        },
      },
    },
  })
  t.end()
})
t.test('opcall: not equal', (t) => {
  const query = `*[_type == "namespace.one" && boolField != true]`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: findSchemaType('namespace.one'),
  })
  t.end()
})

t.test('function: count', (t) => {
  const query = `*[_type == "post"] {
    "name": count(name),
    "allAuthorOrGhostCount": count(allAuthorOrGhost),
    "allAuthorOrGhostCountWithCoalesce": count(coalesce(allAuthorOrGhost, []))
  }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        name: {
          type: 'objectAttribute',
          value: {
            type: 'null',
          },
        },
        allAuthorOrGhostCount: {
          type: 'objectAttribute',
          value: nullUnion({
            type: 'number',
          }),
        },
        allAuthorOrGhostCountWithCoalesce: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
        },
      },
    },
  })
  t.end()
})

t.test('function: global::string', (t) => {
  const query = `*[_type == "author"] {
    "number": string(age),
    "string": string(name),
    "constant": string(3 + 4),
    "boolean": string(true),
    "object": string(object)
  }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        number: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
        },
        string: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
        },
        constant: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: '7',
          },
        },
        boolean: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'true',
          },
        },
        object: {
          type: 'objectAttribute',
          value: {
            type: 'null',
          },
        },
      },
    },
  })
  t.end()
})

t.test('function: references', (t) => {
  const query = `*[_type == "post"] {
    "references": references(_id)
  }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        references: {
          type: 'objectAttribute',
          value: {
            type: 'boolean',
          },
        },
      },
    },
  })
  t.end()
})

t.test('function: string::startsWith', (t) => {
  const query = `*[_type == "author" && string::startsWith(name, "george")] {
    "stringStartsWith": string::startsWith(name, "george"),
    "numberStartsWith": string::startsWith(age, "foo"),
    "stringStartsWithNumber": string::startsWith(name, 123),
  }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        stringStartsWith: {
          type: 'objectAttribute',
          value: {
            type: 'boolean',
          },
        },
        numberStartsWith: {
          type: 'objectAttribute',
          value: {
            type: 'null',
          },
        },
        stringStartsWithNumber: {
          type: 'objectAttribute',
          value: {
            type: 'null',
          },
        },
      },
    },
  })
  t.end()
})

t.test('function: string::split', (t) => {
  const query = `*[_type == "author"] {
    "stringSplit": string::split(name, " "),
    "numberSplit": string::split(age, " "),
    "stringNumberSplit": string::split(name, 123),
  }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        stringSplit: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'string',
            },
          },
        },
        numberSplit: {
          type: 'objectAttribute',
          value: {
            type: 'null',
          },
        },
        stringNumberSplit: {
          type: 'objectAttribute',
          value: {
            type: 'null',
          },
        },
      },
    },
  })
  t.end()
})

t.test('function: array::compact', (t) => {
  const query = `*[_type == "author"] {
    "ages": array::compact(ages),
    "tuple": array::compact([1,2, true, null]),
  }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        ages: {
          type: 'objectAttribute',
          value: nullUnion({
            type: 'array',
            of: {
              type: 'number',
            },
          }),
        },
        tuple: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'union',
              of: [
                {type: 'boolean', value: true},
                {type: 'number', value: 1},
                {type: 'number', value: 2},
              ],
            },
          },
        },
      },
    },
  })
  t.end()
})

t.test('function: array::join', (t) => {
  const query = `*[_type == "author"] {
    "ages": array::join(ages, " "),
    "tuple": array::join([1,2, true], " "),
    "invalidSep": array::join(ages, 123),
  }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        ages: {
          type: 'objectAttribute',
          value: nullUnion({
            type: 'string',
          }),
        },
        tuple: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
        },
        invalidSep: {
          type: 'objectAttribute',
          value: {
            type: 'null',
          },
        },
      },
    },
  })
  t.end()
})

t.test('function: array::unique', (t) => {
  const query = `*[_type == "author"] {
    "ages": array::unique(ages),
    "tuple": array::unique([1,2]),
  }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        ages: {
          type: 'objectAttribute',
          value: nullUnion({
            type: 'array',
            of: {
              type: 'number',
            },
          }),
        },
        tuple: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'union',
              of: [
                {type: 'number', value: 1},
                {type: 'number', value: 2},
              ],
            },
          },
        },
      },
    },
  })
  t.end()
})

t.test('function: math::*', (t) => {
  const query = `*[_type == "author"] {
    "ages": math::min(ages),
    "min": math::min([40, age]),
    "max": math::max([40, age]),
    "sum": math::sum([40, age]),
    "avg": math::avg([40, optionalAge]),
  }`
  const ast = parse(query)
  const res = typeEvaluate(ast, schemas)
  t.strictSame(res, {
    type: 'array',
    of: {
      type: 'object',
      attributes: {
        ages: {
          type: 'objectAttribute',
          value: nullUnion({
            type: 'number',
          }),
        },
        min: {
          type: 'objectAttribute',
          value: unionOf(
            {
              type: 'number',
            },
            {
              type: 'number',
              value: 40,
            },
          ),
        },
        max: {
          type: 'objectAttribute',
          value: unionOf(
            {
              type: 'number',
            },
            {
              type: 'number',
              value: 40,
            },
          ),
        },
        sum: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
        },
        avg: {
          type: 'objectAttribute',
          value: nullUnion({
            type: 'number',
          }),
        },
      },
    },
  })
  t.end()
})

function findSchemaType(name: string): TypeNode {
  const type = schemas.find((s) => s.name === name)
  if (!type) {
    throw new Error(`type ${name} not found`)
  }
  if (type.type === 'document') {
    return {
      type: 'object',
      attributes: type.attributes,
    }
  }
  return type.value
}
