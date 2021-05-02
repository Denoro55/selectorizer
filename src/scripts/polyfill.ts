if (!('remove' in Element.prototype)) {
  (Element.prototype as any).remove = function() {
      if (this.parentNode) {
          this.parentNode.removeChild(this);
      }
  };
}