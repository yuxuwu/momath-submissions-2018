public static class Animation extends WallAnimation {
  
  float map(float x, float in_min, float in_max, float out_min, float out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }
  
  // First, we add metadata to be used in the MoMath system. Change these
  // strings for your behavior.
  String behaviorName = "Example Dynamic Wall Behavior";
  String author = "MoMath";
  String description = "Simple forward-backward behavior.";


  // Now we initialize a few helpful global variables.
  float t = 0;
  
  // The setup block runs at the beginning of the animation. You could
  // also use this function to initialize variables, load data, etc.
  void setup() {
  }     

  // The update block will be repeated for each frame. This is where the
  // action should be programmed.
  void update() {
    float top;
    float bottom;
    
    for (int i = 0; i < wall.slats.length/2; i++) {
      if(i % 6 == 0 || i % 6 + 1 == 1){
        top = 1.0;
        bottom = 1.0;
      }
      top    = sin(((i + t)*i/32));
      bottom = cos(((i + t)*i/32));
      wall.slats[i].setTop(map(top, -1, 1, 0, 1));
      wall.slats[i].setBottom(map(bottom, -1, 1, 0 , 1));
      wall.slats[128-(i+1)].setTop(map(top, -1, 1, 0, 1));
      wall.slats[128-(i+1)].setBottom(map(bottom, -1, 1, 0 , 1));
    }
    t+=QUARTER_PI/2;
  }

  // Leave this function blank
  void exit() {
  }
  
  // You can ignore everything from here.
  String getBehaviorName() {
    return behaviorName;
  }
  
  String getAuthorName() {
    return author;
  }
  
  String getDescription() {
    return description;
  }
  
}
