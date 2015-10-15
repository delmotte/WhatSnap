var generate = {
    index: '{{objectId()}}',
    like: '{{integer(0, 40)}}',
    name: '{{firstName()}} {{surname()}}',
    title: '{{lorem(3, "words")}}',
    content: '{{lorem(1, "paragraphs")}}',
    comments: [
        '{{repeat(5)}}',
        {
            index: '{{objectId()}}',
            like: '{{integer(0, 40)}}',
            name: '{{firstName()}} {{surname()}}',
            title: '{{lorem(3, "words")}}',
            content: '{{lorem(1, "paragraphs")}}',
            comments: [
                '{{repeat(1,10)}}',
                {
                    index: '{{objectId()}}',
                    like: '{{integer(0, 40)}}',
                    name: '{{firstName()}} {{surname()}}',
                    title: '{{lorem(3, "words")}}',
                    content: '{{lorem(1, "paragraphs")}}',
                    comments: [
                        '{{repeat(1,10)}}',
                        {
                            index: '{{objectId()}}',
                            like: '{{integer(0, 40)}}',
                            name: '{{firstName()}} {{surname()}}',
                            title: '{{lorem(3, "words")}}',
                            content: '{{lorem(1, "paragraphs")}}',
                            comments: [
                                '{{repeat(1,10)}}',
                                {
                                    index: '{{objectId()}}',
                                    like: '{{integer(0, 40)}}',
                                    name: '{{firstName()}} {{surname()}}',
                                    title: '{{lorem(3, "words")}}',
                                    content: '{{lorem(1, "paragraphs")}}',
                                    comments: [
                                        '{{repeat(1,10)}}',
                                        {
                                            index: '{{objectId()}}',
                                            like: '{{integer(0, 40)}}',
                                            name: '{{firstName()}} {{surname()}}',
                                            title: '{{lorem(3, "words")}}',
                                            content: '{{lorem(1, "paragraphs")}}',
                                            comments: []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};