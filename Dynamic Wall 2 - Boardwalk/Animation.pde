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
  float period = 30; //time
  float amplitude = 2;
  float distance = 32;
  
  
  // The setup block runs at the beginning of the animation. You could
  // also use this function to initialize variables, load data, etc.
  void setup() {
  }     

  // The update block will be repeated for each frame. This is where the
  // action should be programmed.
  void update() {
    float top;
    float bottom;
    
    for (int i = 0; i < wall.slats.length; i++) {
     
      top    = map(amplitude * cos( ((2*PI)*i/distance) - (2*PI)*t/period ), -1*amplitude, 1*amplitude, 0, 0.9);
      bottom = map(amplitude * sin( ((2*PI)*i/distance) - (2*PI)*t/period + 2), -1*amplitude, 1*amplitude, 0, 0.9);
      
      if(i % 12 < 6){
        top = 1.0;
        bottom = 1.0;
      }
      wall.slats[i].setTop(map(top, -1, 1, 0, 1));
      wall.slats[i].setBottom(map(bottom, -1, 1, 0 , 1));
    }
    t+=QUARTER_PI;
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
