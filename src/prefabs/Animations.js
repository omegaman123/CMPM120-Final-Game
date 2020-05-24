function createAnims(scene){
   scene.anims.create({
       key: 'mountain',
       frameRate:5,
       frames: scene.anims.generateFrameNames('distortionAtlas', {prefix: 'mountain', end: 4}),
       repeat: 5
   }) ;

    scene.anims.create({
        key: 'ravine',
        frameRate:5,
        frames: scene.anims.generateFrameNames('distortionAtlas', {prefix: 'rav', end: 4}),
        repeat: 5
    }) ;

    scene.anims.create({
        key: 'roll',
        frameRate:15,
        frames: scene.anims.generateFrameNames('distortionAtlas', {prefix: 'roll', end: 3}),
        repeat: -1
    }) ;

    scene.anims.create({
        key: 'score',
        frameRate:5,
        frames: scene.anims.generateFrameNames('distortionAtlas', {prefix: 'score', end: 4}),
        repeat: 0
    }) ;
}